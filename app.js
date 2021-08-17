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

const x = canvas.width / 2
const y = canvas.height / 2
const scoreKeeper = document.getElementById('scorekeeper')

const player = new Player(x, y, 30, '#39A6C6')

const projectiles = []
const enemies = []
const randomColors = ['#CE318C', '#31CE73', '#E65119']


//spawns enemies
function enemySpawn() {
    setInterval(() => {
        const radius = Math.random() * 5 + 10
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


// controls animation 
let animationId
let score = 0


function animate() {
    animationId = requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    player.draw()
    projectiles.forEach(projectile => {
        projectile.update()
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
                score += 25
                scoreKeeper.textContent = score

                setTimeout( () =>{
                enemies.splice(index, 1)
                projectiles.splice(projectileIndex, 1)
                }, 0)
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

addEventListener('keydown', pauseGame)

function pauseGame(event) {
    var keyCode = event.keyCode
    if(keyCode == 32) {
        togglePause()
    }
}

// W - A - S - D Directional Movement
addEventListener('keydown', onKeyDown)
addEventListener('keyup', onKeyUp)

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

movePlayer()
animate()
enemySpawn()
