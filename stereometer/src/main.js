import * as THREE from 'three';
import { SVGRenderer } from 'three/addons/renderers/SVGRenderer.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { cube } from './cube'
import { parse } from './parser'
import { newPoint } from './line'
import { world } from './world'
import { rednerPoints } from './points'
import { renderScene } from './caller'
  
let rect = document.getElementById("draw-area").getBoundingClientRect();

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0xcccccc, 0.05);

const camera = new THREE.PerspectiveCamera(
    75, rect.width / rect.height, 0.1, 1000);
camera.position.z = 2;
camera.position.y = 2;
camera.position.x = 2;
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer( {alpha: true} );
renderer.overdraw = 0;
renderer.setSize(rect.width, rect.height);
//renderer.setClearColor(0x000000, 0);
document.getElementById("draw-area").appendChild(renderer.domElement);

/* -    -   -   -   -   -   -   - */

let commands = await parse(
    `cube ABCD_A1B1C1D1(color: blue);
    cube BEFC_B1E1F1C1(color: orange);`
);
let objects = renderScene(commands)
for (let object of objects){
    scene.add(object.sides)
    scene.add(object.edges)
}

// let cube1 = cube(0x00ff00, "A", "B", "C", "D", "A1", "B1", "C1", "D1");
// scene.add(cube1.sides);
// scene.add(cube1.edges);
// let cube2 = cube(0xffff00, "B", "E", "F", "C", "B1", "E1", "F1", "C1");
// scene.add(cube2.sides);
// scene.add(cube2.edges);
// try{
//     let p1= newPoint("J", 0.5, "A", "D")
//     let p2 = newPoint("I1", 3/4, "A", "F1")
//     scene.add(p1.point)
//     scene.add(p1.line)
//     scene.add(p2.point)
//     scene.add(p2.line)
// }catch (err){
//     console.log(err)
// }

// let smallCube = cube(0x0000ff, "A", "G", "J", "H", "A1", "G1", "J1", "H1");
// scene.add(smallCube.sides);
// scene.add(smallCube.edges);

// let bigCube = cube(0xffaa00, "I1", "E1", "K", "L", "M", "N", "O", "P");
// scene.add(bigCube.sides);
// scene.add(bigCube.edges);

let names = rednerPoints()
for (let name of names){
    scene.add(name)
    //name.sync();
}

const controls = new OrbitControls(camera, renderer.domElement);
controls.zoomToCursor = true;
controls.cursorStyle = "grab";
controls.update();

console.log(world.toString())

/*controls.addEventListener('change', () => {
    names.forEach(p => p.quaternion.copy(camera.quaternion))
    renderer.render(scene, camera);
})
renderer.render(scene, camera);*/

function animate(time){
    controls.update();
    names.forEach(p => p.quaternion.copy(camera.quaternion))
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);


/* -    -   -   -   -   -   - */

const editor = document.getElementById("code-area");