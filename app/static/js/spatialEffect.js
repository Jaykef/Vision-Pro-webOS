const parallax = document.getElementById("parallax");
const rect = parallax.getBoundingClientRect();
const icons = document.getElementsByClassName("ui")[0];
const iconsRect = icons.getBoundingClientRect();
var pos = {
  x: 0,
  y: 0

    import * as THREE from 'three';

    import { OrbitControls } from '../libs/Threejs/OrbitControls.js';

    let camera, controls;
    let renderer;
    let scene;

    init();
    animate();

    function init() {

      const container = document.getElementById( 'parallax' );

      renderer = new THREE.WebGLRenderer();
      renderer.setPixelRatio( window.devicePixelRatio );
      renderer.setSize( window.innerWidth, window.innerHeight );
      container.appendChild( renderer.domElement );

      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 100 );
      camera.position.z = 0.01;

      controls = new OrbitControls( camera, renderer.domElement );
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.enableDamping = true;
      controls.rotateSpeed = - 0.25;

      const textures = getTexturesFromAtlasFile( './static/img/sun_temple_stripe.jpg', 6 );

      const materials = [];

      for ( let i = 0; i < 6; i ++ ) {

        materials.push( new THREE.MeshBasicMaterial( { map: textures[ i ] } ) );

      }

      const skyBox = new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 1 ), materials );
      skyBox.geometry.scale( 1, 1, - 1 );
      scene.add( skyBox );

      window.addEventListener( 'resize', onWindowResize );

    }

    function getTexturesFromAtlasFile( atlasImgUrl, tilesNum ) {

      const textures = [];

      for ( let i = 0; i < tilesNum; i ++ ) {

        textures[ i ] = new THREE.Texture();

      }

      new THREE.ImageLoader()
        .load( atlasImgUrl, ( image ) => {

          let canvas, context;
          const tileWidth = image.height;

          for ( let i = 0; i < textures.length; i ++ ) {

            canvas = document.createElement( 'canvas' );
            context = canvas.getContext( '2d' );
            canvas.height = tileWidth;
            canvas.width = tileWidth;
            context.drawImage( image, tileWidth * i, 0, tileWidth, tileWidth, 0, 0, tileWidth, tileWidth );
            textures[ i ].colorSpace = THREE.SRGBColorSpace;
            textures[ i ].image = canvas;
            textures[ i ].needsUpdate = true;

          }

        } );

      return textures;

    }

    function onWindowResize() {

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize( window.innerWidth, window.innerHeight );

    }

    function animate() {

      requestAnimationFrame( animate );

      controls.update();

      renderer.render( scene, camera );

    }
};
var mousePos = {
  x: 0,
  y: 0
};
var iconPos = {
  x: 0,
  y: 0
}
var iconDesiredPos = {
  x: 0,
  y: 0
}
parallax.addEventListener("pointermove", function (e) {
  mousePos = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
    
  iconDesiredPos = {
    x: (e.clientX - window.innerWidth / 2) - iconsRect.left,
    y: (e.clientY - window.innerHeight / 2) - iconsRect.top
  }
  
});
function render() {
  pos.x += easing(pos.x, mousePos.x, 0.01);
  pos.y += easing(pos.y, mousePos.y, 0.01);
  parallax.style.transformOrigin = `${pos.x}px ${pos.y}px`;
  parallax.style.transform = `scale(1.25)`;
  
  iconPos.x += easing(iconPos.x, iconDesiredPos.x / -10, 0.01);
  iconPos.y += easing(iconPos.y, iconDesiredPos.y / -10, 0.01);
  icons.style.transform = `translateX(${iconPos.x}px) translateY(${iconPos.y}px)`;
  
  requestAnimationFrame(render);
}
render();
function easing(a, b, speed) {
  return (b - a) * speed;
}

function webView() {
    var webview = document.createElement("webview");
    webview.src = "https://www.google.com";
    webview.style.width = "100%";
    webview.style.height = "100%";
    document.body.appendChild(webview);
}



