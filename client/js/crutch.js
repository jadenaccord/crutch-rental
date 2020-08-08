import * as THREE from 'https://unpkg.com/three@0.119.1/build/three.module.js';
import { OBJLoader } from 'https://unpkg.com/three@0.119.1/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls } from 'https://unpkg.com/three@0.119.1/examples/jsm/controls/OrbitControls.js';

var container = document.getElementById('three-container');
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
    75,
    container.offsetWidth / container.offsetHeight,
    0.1,
    1000
);

var renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(container.offsetWidth, container.offsetHeight);
container.appendChild(renderer.domElement);

var controls = new OrbitControls(camera, renderer.domElement);
camera.position.z = 75;
controls.update();

var crutch;
var loader = new OBJLoader();
loader.setPath('models/')
loader.load(
    'crutch.obj',
    function (obj) {
        crutch = obj;
        crutch.position.y = -25;
        crutch.position.x = -37;
        crutch.rotation.z = -1;
        scene.add(crutch);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    function (err) {
        console.error('THREE ran into an error!');
    }
);

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();
