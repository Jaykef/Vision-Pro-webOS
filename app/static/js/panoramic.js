import * as THREE from "three";

const panoramasArray = ["./static/img/livingroom_3.jpg"];
let panoramaNumber = Math.floor(Math.random() * panoramasArray.length);

const app = document.getElementById("parallax");
let scene;
let renderer;
let camera;
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
let fov = 75;
let lon = 0;
let lat = 0;
let phi = 0;
let theta = 0;
const nearPlane = 1;
const farPlane = 1000;
let aspect = windowWidth / windowHeight;
const dpr = window.devicePixelRatio;
let sphereMaterial;
let isManual = false;
let lastMouseX = 0;
let lastMouseY = 0;
let lastLon = 0;
let lastLat = 0;

function init() {
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(windowWidth, windowHeight);
  renderer.setPixelRatio(dpr);
  app.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, aspect, nearPlane, farPlane);
  camera.target = new THREE.Vector3(0, 0, 0);

  createSphere();
  initEventListeners();
  animate();
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

function initEventListeners() {
  document.addEventListener("mousedown", handleDocumentMouseDown, false);
  document.addEventListener("mousemove", handleDocumentMouseMove, false);
  document.addEventListener("mouseup", handleDocumentMouseUp, false);
  document.addEventListener("touchstart", handleDocumentMouseDown, false);
  document.addEventListener("touchmove", handleDocumentMouseMove, false);
  document.addEventListener("touchend", handleDocumentMouseUp, false);

  // when a user clicks on space we change panorama
  document.addEventListener("keyup", handleKeyUp);

  // Drag n Drop to load new panorama
  document.addEventListener("dragover", handleDragOver, false);
  document.addEventListener("dragenter", handleDragEnter, false);
  document.addEventListener("dragleave", handleDragLeave, false);
  document.addEventListener("drop", handleDrop, false);

  window.addEventListener("resize", resizeWindow);
}

function animate() {
  requestAnimationFrame(animate);
  if (!isManual) {
    lat += 0.02;
  }
  phi = ((320 - lat) * Math.PI) / 180;
  theta = (lon * Math.PI) / 180;
  // Transform from Spherical to Cartesian coordinates
  camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
  camera.target.y = 500 * Math.sin(phi) * Math.sin(theta);
  camera.target.z = 500 * Math.cos(phi);

  camera.lookAt(camera.target);
  render();
}

function resizeWindow() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  const canvasPixelWidth = canvas.width / dpr;
  const canvasPixelHeight = canvas.height / dpr;

  if (canvasPixelWidth !== width || canvasPixelHeight !== height) {
    renderer.setSize(width, height, false);
  }
}

function render() {
  renderer.render(scene, camera);
}

function handleKeyUp(event) {
  if (event.code === "Space") {
    panoramaNumber = (panoramaNumber + 1) % panoramasArray.length;
    sphereMaterial.map = new THREE.TextureLoader().load(
      panoramasArray[panoramaNumber]
    );
  }
}

// when the mouse is pressed, we switch to manual control and save current coordinates
function handleDocumentMouseDown(event) {
  event.preventDefault();
  isManual = true;

  const clientX = event.clientX || event.touches[0].clientX;
  const clientY = event.clientY || event.touches[0].clientY;

  lastMouseX = clientX;
  lastMouseY = clientY;

  lastLon = lon;
  lastLat = lat;
}

// when the mouse moves, if in manual control we adjust coordinates
function handleDocumentMouseMove(event) {
  if (isManual) {
    const clientX = event.clientX || event.touches[0].clientX;
    const clientY = event.clientY || event.touches[0].clientY;

    lat = (clientX - lastMouseX) * 0.1 + lastLat;
    lon = (clientY - lastMouseY) * 0.1 + lastLon;
  }
}

// when the mouse is released, we turn manual control off
function handleDocumentMouseUp() {
  isManual = false;

  lastMouseX = 0;
  lastMouseY = 0;

  lastLon = 0;
  lastLat = 0;
}

function handleDragOver(event) {
  event.preventDefault();
  event.stopPropagation();
  event.dataTransfer.dropEffect = "copy";
}

function handleDragEnter(event) {
  event.preventDefault();
  event.stopPropagation();
  app.style.opacity = 1;
}

function handleDragLeave(event) {
  event.preventDefault();
  event.stopPropagation();
  app.style.opacity = 1;
}

function handleDrop(event) {
  event.preventDefault();
  event.stopPropagation();

  const reader = new FileReader();
  reader.addEventListener(
    "load",
    function (event) {
      sphereMaterial.map.image.src = event.target.result;
      sphereMaterial.map.needsUpdate = true;
    },
    false
  );
  reader.readAsDataURL(event.dataTransfer.files[0]);

  app.style.opacity = 1;
}

function cleanup() {
  document.removeEventListener("mousedown", handleDocumentMouseDown, false);
  document.removeEventListener("mousemove", handleDocumentMouseMove, false);
  document.removeEventListener("mouseup", handleDocumentMouseUp, false);
  document.removeEventListener("touchstart", handleDocumentMouseDown, false);
  document.removeEventListener("touchmove", handleDocumentMouseMove, false);
  document.removeEventListener("touchend", handleDocumentMouseUp, false);

  document.removeEventListener("keyup", handleKeyUp);

  document.removeEventListener("dragover", handleDragOver, false);
  document.removeEventListener("dragenter", handleDragEnter, false);
  document.removeEventListener("dragleave", handleDragLeave, false);
  document.removeEventListener("drop", handleDrop, false);

  window.removeEventListener("resize", resizeWindow);
}

window.onload = init;

window.onunload = cleanup;

