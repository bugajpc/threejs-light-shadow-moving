import * as THREE from 'three';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
renderer.setSize( window.innerWidth, window.innerHeight - 100 );
document.body.appendChild( renderer.domElement );

//Create a PointLight and turn on shadows for the light
const light = new THREE.PointLight( 0xffffff, 50, 100 );
light.position.set( 0, 8, 3 );
light.castShadow = true; // default false
scene.add( light );

const lightA = new THREE.AmbientLight( 0x505050 ); // soft white light
scene.add( lightA );

//Set up shadow properties for the light
light.shadow.mapSize.width = 2000;
light.shadow.mapSize.height = 2000;
light.shadow.camera.near = 0.5; // default
light.shadow.camera.far = 500; // default

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
cube.castShadow = true; //default is false
scene.add( cube );

const planeGeometry = new THREE.PlaneGeometry( 40, 20 );
const planeMaterial = new THREE.MeshStandardMaterial( {color: 0xffff00, side: THREE.DoubleSide} )
const plane = new THREE.Mesh( planeGeometry, planeMaterial );
plane.receiveShadow = true;
scene.add( plane );

plane.rotation.x += 1.6
plane.position.y -= 2
camera.position.z = 10;

let score = 0
const scoreH1 = document.getElementById("score")
let playState = false
let movingRight = false
let movingLeft = false
const gravity = -0.01
const jumpStrength = 0.2
let velocityY = 0
let obstacles = []

function animate() {
	requestAnimationFrame( animate );

    if(playState) {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        obstacles.forEach( obstacle => {
            obstacle.position.x -= 0.1
        } )
        
        checkCollision()

        velocityY += gravity
        cube.position.y += velocityY

        if(cube.position.y < 0) {
            velocityY = 0;
            cube.position.y = 0;
        }

        if(movingRight) {
            cube.position.x += 0.1
        }
        if(movingLeft) {
            cube.position.x -= 0.1
        }
    }
    
    renderer.render( scene, camera );
}

function play(event) {
    if(event.code === "KeyP") {
        playState = !playState
    }
    if(event.code === "KeyA") {
        movingLeft = true
    }
    if(event.code === "KeyD") {
        movingRight = true
    }
    if(event.code === "Space") {
        velocityY = jumpStrength
    }
}
function stopMoving(event) {
    if(event.code === "KeyA") {
        movingLeft = false
    }
    if(event.code === "KeyD") {
        movingRight = false
    }
}

function createObstacle() {
    const randY = Math.random() * 5
    const geometryO = new THREE.BoxGeometry( 1, 1, 1 );
    const materialO = new THREE.MeshStandardMaterial( { color: 0xff0000 } );
    const cubeO = new THREE.Mesh( geometryO, materialO );
    cubeO.position.x = 10
    cubeO.position.y = randY
    cubeO.castShadow = true; //default is false
    obstacles.push( cubeO )
    scene.add( cubeO );

    if(obstacles.length >= 4) {
        scene.remove(obstacles[0])
        obstacles.shift()
    }
}

async function checkCollision() {
    const cubeLeft = cube.position.x - 0.5
    const cubeRight = cube.position.x + 0.5
    const cubeTop = cube.position.y + 0.5
    const cubeBottom = cube.position.y - 0.5

    obstacles.forEach(obstacle => {
        if(obstacle.position.x > cubeLeft && obstacle.position.x < cubeRight) {
            if(obstacle.position.y + 0.6 >= cubeBottom && obstacle.position.y + 0.3 <= cubeBottom) {
                velocityY = jumpStrength
                score += 1
                obstacles = obstacles.filter(o => o != obstacle)
                scene.remove(obstacle)
            }
            if(obstacle.position.y > cubeBottom && obstacle.position.y < cubeTop) {
                playState = false
                obstacles = obstacles.filter(o => o != obstacle)
                scene.remove(obstacle)
                score = 0
            }
            scoreH1.innerHTML = "Score: " + score
        }
    })
}

setInterval(createObstacle, 1500)

document.addEventListener("keydown", play)
document.addEventListener("keyup", stopMoving)
animate();