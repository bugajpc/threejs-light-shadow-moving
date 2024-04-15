import * as THREE from 'three';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
renderer.setSize( window.innerWidth, window.innerHeight );
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

let velocityY = 0
const gravity = -0.01
const jumpStrength = 0.2
let playState = false
let movingLeft = false
let movingRight = false

let obstacles = []

function createObstacle() {
    const randY = Math.random() * 5
    const oGeometry = new THREE.BoxGeometry( 1, 1, 1 );
    const oMaterial = new THREE.MeshStandardMaterial( { color: 0xff0000 } );
    const obstacle = new THREE.Mesh(oGeometry, oMaterial);
    scene.add( obstacle )
    obstacle.position.x = 10
    obstacle.position.y = randY
    obstacles.push( obstacle )
}

async function checkCollision() {
    const cubeLeft = cube.position.x - 0.5
    const cubeRight = cube.position.x + 0.5

    const cubeY = cube.position.y - 0.5
    
    obstacles.forEach(obstacle => {
        if((obstacle.position.x > cubeLeft && obstacle.position.x < cubeRight)) {
            if(cubeY < obstacle.position.y + 0.5) {
                playState = false
                obstacles.forEach(o => {
                    scene.remove(o)
                })
                obstacles = []
            }
            else if(cubeY > obstacle.position.y + 0.5 && cubeY < obstacle.position.y + 1.5){
                velocityY = jumpStrength
            }
        }
    })
}

function animate() {
	requestAnimationFrame( animate );

    if(playState) {
        velocityY += gravity
        cube.position.y += velocityY

        if(cube.position.y < 0) {
            velocityY = 0
            cube.position.y = 0
        }
        if(movingRight) {
            cube.position.x += 0.1
        }
        if(movingLeft) {
            cube.position.x -= 0.1
        }

        if(obstacles.length >= 5) {
            scene.remove(obstacles[0])
            obstacles.shift()
        }

        checkCollision()

        obstacles.forEach(obstacle => {
            obstacle.position.x -= 0.1
        });

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
    }
    
    renderer.render( scene, camera );
}

function play(event) {
    if(event.code === "Space" && playState) {
        velocityY = jumpStrength
    }
    if(event.code === "KeyP") {
        playState = !playState
    }
    if(event.code === "KeyA") {
        movingLeft = true
    }
    if(event.code === "KeyD") {
        movingRight = true
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

setInterval(createObstacle, 2000)

document.addEventListener("keydown", play)
document.addEventListener("keyup", stopMoving)

animate();