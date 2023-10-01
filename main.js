import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

var clock = new THREE.Clock();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(50);
camera.position.setX(0);

const pointLight = new THREE.PointLight(0xFFFFFF);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xFFFFFF, 4.0);
scene.add(pointLight, ambientLight);


const skyTexture = new THREE.TextureLoader().load('bg.png');
scene.background = skyTexture;

const loader = new GLTFLoader();
var mixer = undefined;

loader.load(
	'chest.gltf',
	function ( gltf ) {

		scene.add( gltf.scene );

        mixer = new THREE.AnimationMixer(scene);
        gltf.animations.forEach((clip) => {mixer.clipAction(clip).play(); });

        gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Group
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object

	},
);

const blackMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

// create a fullscreen quad
const geometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);
const quad = new THREE.Mesh(geometry, blackMaterial);
scene.add(quad);

// set initial opacity to fully black
quad.material.transparent = true;
quad.material.opacity = 1;

const animate = () => {
    requestAnimationFrame(animate);
  
    // Update the material's opacity
    quad.material.opacity -= 0.02;

    var delta = clock.getDelta();
    if (mixer) mixer.update( delta );
  
    // Render the scene
    renderer.render(scene, camera);
  };
  
  // Start the animation
  animate();