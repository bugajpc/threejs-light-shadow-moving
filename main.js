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

const lightA = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( lightA );

//Set up shadow properties for the light
light.shadow.mapSize.width = 2000; // default
light.shadow.mapSize.height = 2000; // default
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
const jumpStrength = 0.20
let playState = false

let movingLeft = false
let movingRight = false

function animate() {
	requestAnimationFrame( animate );

    if(playState) {
        velocityY += gravity
        cube.position.y += velocityY
        if(cube.position.y < 0) {
            cube.position.y = 0
            velocityY = 0
        }
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        //moving left or right
        if(movingRight) {
            cube.position.x += 0.05
        }
        if(movingLeft) {
            cube.position.x -= 0.05
        }
    }
    renderer.render( scene, camera );
}

function play(event) {
    if(event.code === "Space" && playState) {
        velocityY = jumpStrength
    }
    else if(event.code === "KeyP") {
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

document.addEventListener("keydown", play)
document.addEventListener("keyup", stopMoving)

animate();