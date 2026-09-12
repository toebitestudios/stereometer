import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { drawCube } from './cube'
import { parse } from './parser'
import { newPoint } from './line'
import { world } from './world'
import { rednerPoints } from './points'
  
let rect = document.getElementById("draw-area").getBoundingClientRect();

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0xcccccc, 0.05);

const camera = new THREE.PerspectiveCamera(
    75, rect.width / rect.height, 0.1, 1000);

const renderer = new THREE.WebGLRenderer( {alpha: true} );
renderer.setSize(rect.width, rect.height);
renderer.setClearColor(0x000000, 0);
document.getElementById("draw-area").appendChild(renderer.domElement);

/* -    -   -   -   -   -   -   - */

let commands = await parse("cube ABCD_A1B1C1D1(color: blue);\nline AD(yellow);\nI = 0.5*AB;");
console.log(commands)

let cube1 = drawCube(0x00ff00, "A", "B", "C", "D", "A1", "B1", "C1", "D1");
scene.add(cube1.sides);
scene.add(cube1.edges);
let cube2 = drawCube(0xffff00, "B", "E", "F", "C", "B1", "E1", "F1", "C1");
scene.add(cube2.sides);
scene.add(cube2.edges);
try{
    let p1= newPoint("J", 0.5, "A", "D")
    let p2 = newPoint("I1", 3/4, "A", "F1")
    scene.add(p1.point)
    scene.add(p1.line)
    scene.add(p2.point)
    scene.add(p2.line)
}catch (err){
    console.log(err)
}

let smallCube = drawCube(0x0000ff, "A", "G", "J", "H", "A1", "G1", "J1", "H1");
scene.add(smallCube.sides);
scene.add(smallCube.edges);

let bigCube = drawCube(0xffaa00, "M", "N", "R", "P", "A", "E", "K", "L");
scene.add(bigCube.sides);
scene.add(bigCube.edges);

let names = rednerPoints()
for (let name of names){
    scene.add(name)
    //name.sync();
}

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.z = 2;
camera.position.y = 2;
camera.position.x = 2;
camera.lookAt(0, 0, 0);
controls.update();

function animate(time){
    controls.update();
    names.forEach(p => p.quaternion.copy(camera.quaternion))
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);


/* -    -   -   -   -   -   - */

const editor = document.getElementById("code-area");