const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')
canvas.width = innerWidth
canvas.height = innerHeight

//player
class Player {
    constructor(x, y, radius, color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }

    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

// projectiles
class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }

    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

// enemies
class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }

    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

// particles
class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.alpha = 1
    }

    draw() {
        c.save()
        c.globalAlpha = this.alpha
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
        c.restore()
    }

    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
        this.alpha -= 0.01
    }
}

// powerups
class Powerup {
    constructor(x, y, radius, color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }

    update() {
        this.draw()
    }
}

const x = canvas.width / 2
const y = canvas.height / 2
const scoreKeeper = document.getElementById('scorekeeper')

const player = new Player(x, y, 25, '#39A6C6')

const projectiles = []
const enemies = []
const particles = []
const powerups = []

const randomColors = ['#CE318C', '#31CE73', '#E65119']


//spawns enemies
function enemySpawn() {
    setInterval(() => {
        const radius = Math.random() * 10 + 10
        const x = Math.random() * canvas.width
        const y = Math.random() < .5 ? 0 - radius : canvas.height + radius
        const color = randomColors[Math.floor(Math.random() * 3)]
        const angle = Math.atan2(y - player.y, x - player.x)
        const velocity = {
            x: -Math.cos(angle),
            y: -Math.sin(angle)
        }
        
        enemies.push(new Enemy(x, y, radius, color, velocity))
    }, 500)
}

function powerupSpawn() {
    
        const radius = 10
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const color = 'blue'

        if(score == 10) {
            powerups.push(new Powerup(x, y, radius, color))
        }
}


// controls animation 
let animationId
let score = 0


        function animate() {
            animationId = requestAnimationFrame(animate)
            c.fillStyle = 'rgba(0, 0, 0, 0.2)'
            c.fillRect(0, 0, canvas.width, canvas.height)
            player.draw()
                


            particles.forEach((particle, index) => {
                if(particle.alpha <= 0) {
                    particles.splice(index, 1)
                }
                else {
                    particle.update()
                }
            })

            
            projectiles.forEach((projectile, index) => {
                projectile.update()
    
                if(projectile.x + projectile.radius < 0 || projectile.x - projectile.radius
                    > canvas.width || projectile.y + projectile.radius < 0 || projectile.y - projectile.radius 
                    > canvas.width) {
                        setTimeout(() => {
                            projectiles.splice(index, 1)
                        }, 0)
                    }
    
            })

            powerups.forEach((powerup, index) => {
                powerup.draw()
            })
            

        
        
    
        enemies.forEach((enemy, index) => {
            enemy.update()
    
            const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)
                
                //player death
                if(dist - enemy.radius - player.radius < 1) {

                    cancelAnimationFrame(animationId)
                }
            
            // remove enemies when projectiles hit
            projectiles.forEach((projectile, projectileIndex) => {
                const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
    
    
                if(dist - enemy.radius - projectile.radius < 1) {

                    for(let i = 0; i < 8; i++) {
                        particles.push(new Particle(projectile.x, projectile.y, Math.random() * 2 + 3, enemy.color, 
                            {
                            x: (Math.random() - 0.5) * (Math.random() * 4 + 1), 
                            y: (Math.random() - 0.5) * (Math.random() * 4 + 1)
                            }
                            ))
                    }

                    // keep score when enemies are hit
                    score += 2
                    scoreKeeper.textContent = score

                    //shrinking effect
                    if(enemy.radius - 5 > 10) {
                        gsap.to(enemy, {
                            radius: enemy.radius - 10
                        })
                        setTimeout( () =>{
                            projectiles.splice(projectileIndex, 1)
                            }, 0)
                    } else {
                        setTimeout( () =>{
                            enemies.splice(index, 1)
                            projectiles.splice(projectileIndex, 1)
                            }, 0)
                    }
                    
                }         
                
            })
        }) 
    
    }





// shoot projectiles
addEventListener('click', (event) => {
    const angle = Math.atan2(event.clientY - player.y, event.clientX - player.x)
    const velocity = {
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5
    }

    const red = new Projectile(player.x, player.y, 5, '#C65939', velocity)
    const white = new Projectile(player.x, player.y, 5, 'white', {x: Math.cos(angle) * 10, y: Math.sin(angle) * 10})
    
    //red
    if(score < 25) {
        projectiles.push(red)
    }

    if(score >= 25) {
        projectiles.push(white)
    }
    
    
    
})

// pause the game


// W - A - S - D Directional Movements & Pause Game
addEventListener('keydown', onKeyDown)
addEventListener('keyup', onKeyUp)

//functions
function onKeyDown(event) {
    var keyCode = event.keyCode
    switch(keyCode) {
        case 87: //w
        keyW = true;
        break;

        case 65: //a
        keyA = true;
        break;

        case 83: //s
        keyS = true;
        break;

        case 68: //d
        keyD = true;
        break;
    }
}

function onKeyUp(event) {
    var keyCode = event.keyCode
    switch(keyCode) {
        case 87: //w
        keyW = false;
        break;

        case 65: //a
        keyA = false;
        break;

        case 83: //s
        keyS = false;
        break;

        case 68: //d
        keyD = false;
        break;
    }
}

// setting directional values to false
var keyW = false,
keyA = false,
keyS = false,
keyD = false

function movePlayer() {
    requestAnimationFrame(movePlayer)
    if(keyW == true) {
        player.y -= 5
    }
    if(keyA == true) {
        player.x -= 5
    }
    if(keyS == true) {
        player.y += 5
    }
    if(keyD == true){
        player.x += 5
    }
}






// calling functions

movePlayer()
animate()
enemySpawn()
powerupSpawn()
