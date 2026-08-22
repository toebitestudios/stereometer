import * as THREE from 'three'

const vertexName = /[A-Z][0-9]?|_/g;

function drawCube(name, length){
    const geometry = new THREE.BoxGeometry(length, length, length);
    const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    const cube = new THREE.Mesh(geometry, material);

    let vertexNames = [...name.matchAll(vertexName)];
    let center = cube.position;
    let start = {
        x: center.x - length/2,
        y: center.y - length/2,
        z: center.z + length/2
    }
    let vertices = [
        start.x, start.y, start.z,
        start.x + length, start.y, start.z,
        start.x + length, start.y, start.z - length,
        start.x, start.y, start.z - length,

        start.x, start.y + length, start.z,
        start.x + length, start.y + length, start.z,
        start.x + length, start.y + length, start.z - length,
        start.x, start.y + length, start.z - length
    ]

    

    //console.log(vertices);
    return cube

}

export { drawCube };