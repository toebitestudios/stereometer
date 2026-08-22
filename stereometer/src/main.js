import * as THREE from 'three';
import { drawCube } from './cube'
import { parse } from './parser'
import { view } from './editor'

let rect = document.getElementById("draw-area").getBoundingClientRect();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75, rect.width / rect.height, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(rect.width, rect.height);
document.getElementById("draw-area").appendChild(renderer.domElement);

/* -    -   -   -   -   -   -   - */

let command = parse("cube ABCD_A1B1C1D1(color: blue);\nline AD(yellow);");

let cube = drawCube("ABCD", 1);
scene.add(cube);

const lineMaterial = new THREE.LineBasicMaterial( { color: 0x0000ff } );
const points = []
points.push( new THREE.Vector3(-2, 0, 0) );
points.push( new THREE.Vector3(0, 2, 0) );
points.push( new THREE.Vector3(2, 0, 0) );
points.push( new THREE.Vector3(0, -2, 0) );
points.push( new THREE.Vector3(-2, 0, 0) );
const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
const line = new THREE.Line(lineGeometry, lineMaterial);
scene.add(line);

camera.position.z = 5;

function animate(time){
    cube.rotation.x = time / 2000;
    cube.rotation.y = time / 1000;
    line.rotation.x = time / 2000;
    line.rotation.y = time / 1000;
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

/* -    -   -   -   -   -   - */

const editor = document.getElementById("code-area");