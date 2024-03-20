// import * as THREE from 'three';
import * as THREE from 'https://unpkg.com/three/build/three.module.js';

let scene, camera, renderer, cube;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    animate();
    fetchCubeDimensions();
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

async function fetchCubeDimensions() {
    try {
        const response = await fetch('http://localhost:8001/cube');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        cube.scale.set(data.width, data.height, data.length);
    } catch (error) {
        console.error("Failed to fetch cube dimensions:", error);
    }
}

async function updateCubeDimensions(width, height, length) {
    try {
        const response = await fetch('http://localhost:8001/cube', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ width, height, length }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data.message);
        fetchCubeDimensions();
    } catch (error) {
        console.error("Failed to update cube dimensions:", error);
    }
}

function sendUpdateRequest() {
    const width = parseFloat(document.getElementById('width').value);
    const height = parseFloat(document.getElementById('height').value);
    const length = parseFloat(document.getElementById('length').value);

    updateCubeDimensions(width, height, length);
}

document.addEventListener('DOMContentLoaded', () => {
    init();
    document.getElementById('updateButton').addEventListener('click', sendUpdateRequest);
});