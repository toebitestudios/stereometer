import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { world } from './world'
import { rednerPoints } from './points'
import { renderScene } from './caller'

import { parse } from './regex'

class UnexpectedError extends Error{
    constructor(message){
        super(message);
    }
}

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

let commands = await parse(
    `cube ABCD_A1B1C1D1(color: #ff00ff);
    H = 0.25 * DB1;
    cube DHIJ_D'H1I1J1(color: #00ffff);`
);
console.log(commands)

let objects = renderScene(commands)
for (let object of objects){
    if (object.geometry == "body"){
        scene.add(object.edges)
        scene.add(object.sides)
    }else if (object.geometry == "point"){
        scene.add(object.point)
        scene.add(object.line)
    }else{
        throw new UnexpectedError("name?", "Non existant geometry parsed.")
    }
}
console.log(world.toString())

let names = rednerPoints()
for (let name of names){
    scene.add(name)
    //name.sync();
}

const controls = new OrbitControls(camera, renderer.domElement);
controls.zoomToCursor = true;
controls.cursorStyle = "grab";
controls.update();

function animate(){
    controls.update();
    names.forEach(p => p.quaternion.copy(camera.quaternion))
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

/* -    -   -   -   - */

let cmd = document.getElementById("cmd")

let highlightLine = document.createElement("div")
highlightLine.id = "hl"
highlightLine.innerHTML = "";
//highlightLine.setAttribute("visible", "false");
highlightLine.addEventListener("click", (e) => {
    e.target.style.backgroundColor = "rgba(204, 204, 204, 0.5)";
    e.target.style.zIndex = "0"
    // treba i prebaciti fokus na textarea
})
cmd.appendChild(highlightLine)

let code = document.createElement("textarea");
code.innerHTML = "cube ABCD_A1B1C1D1(color: #ff00ff)";
cmd.appendChild(code)
code.addEventListener("input", e => {
    console.log(e.target.value)
})