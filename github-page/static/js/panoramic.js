import * as THREE from "three";
import { OrbitControls } from '../libs/Threejs/OrbitControls.js';
const panoramasArray = ["./github-page/static/img/livingroom_3.jpg"];
let panoramaNumber = Math.floor(Math.random() * panoramasArray.length);


let scene;
let renderer;
let camera, controls;
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
let lon = 0;
let lat = 0;
let phi = 0;
let theta = 0;
const dpr = window.devicePixelRatio;
let sphereMaterial;
let isUserInteracting = false;

init();
animate();

function init() {
    const container = document.getElementById("parallax");

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(windowWidth, windowHeight);
    renderer.setPixelRatio(dpr);
    container.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 100 );
    camera.target = new THREE.Vector3(0, 0, 0);
    camera.position.z = 0.01;

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableRotate = true;

    createSphere();
    window.addEventListener( 'resize', onWindowResize );
}

function createSphere() {
    const sphere = new THREE.SphereGeometry(100, 100, 40);
    sphere.applyMatrix4(new THREE.Matrix4().makeScale(-1, 1, 1));
    sphereMaterial = new THREE.MeshBasicMaterial();
    sphereMaterial.map = new THREE.TextureLoader().load(
        panoramasArray[panoramaNumber]
    );

    const sphereMesh = new THREE.Mesh(sphere, sphereMaterial);
    scene.add(sphereMesh);
}


function animate() {
    requestAnimationFrame(animate);
  
    // if (controls.enabled)

    // if ( isUserInteracting === false ) {

    //     controls.update();
    //     lon += 0.01;
    // }

    // lat = Math.max(200, Math.min(230, lat ) );
    // phi = THREE.MathUtils.degToRad( 110 - lat );
    // theta = THREE.MathUtils.degToRad( lon );

    // const x = 500 * Math.sin( phi ) * Math.cos( theta );
    // const y = 500 * Math.cos( phi );
    // const z = 500 * Math.sin( phi ) * Math.sin( theta );

    // camera.lookAt( x, y, z );
    renderer.render( scene, camera );
    render();  
}



function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}


function render() {
  renderer.render(scene, camera);
}


