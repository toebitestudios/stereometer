import * as THREE from 'three'
import { world } from './world'

const abstractCube = [
    -1, -1, 1,
    1, -1, 1, 
    1, -1, -1,
    -1, -1, -1,

    -1, 1, 1,
    1, 1, 1, 
    1, 1, -1,
    -1, 1, -1
];

// TO-DO:
// provjera slaže li se poredak vrhova
function generateCubeCoords(...vertices){
    let translationVector = [0, 0, 0]
    let firstPoint;
    for (let i = 0; i < 8; i++){
        firstPoint = world[vertices[i]]
        if (firstPoint){
            translationVector = [
                firstPoint[0] - abstractCube[i*3 + 0],
                firstPoint[1] - abstractCube[i*3 + 1],
                firstPoint[2] - abstractCube[i*3 + 2]
            ]
            break;
        }
    }

    let coords = []
    let temp = [0, 0, 0];
    for (let i = 0; i < 8; i++){
        temp = [
            abstractCube[i*3+0] + translationVector[0],
            abstractCube[i*3+1] + translationVector[1],
            abstractCube[i*3+2] + translationVector[2]
        ]
        coords.push(...temp)
        if (!world[vertices[i]]){ 
            world[vertices[i]] = temp
        }
    }

    let center = [
        (coords[0*3 + 0] + coords[6*3 + 0])/2.0,
        (coords[0*3 + 1] + coords[6*3 + 1])/2.0,
        (coords[0*3 + 2] + coords[6*3 + 2])/2.0
    ]
    let edgeLength = Math.abs(coords[0*3 + 0] - coords[1*3 + 0]);

    return {
        coords: coords,
        center: center,
        edgeLength: edgeLength
    }

}

// front/back side, fog/fogexp2 s raznim parametrima, opacity, css background
// -> za najbolji izgled
// => fog: on/off da korisnik može

function drawCube(color, ...verticesNames){
    let cubeInfo = generateCubeCoords(...verticesNames);
    const geometry = new THREE.BoxGeometry(cubeInfo.edgeLength, cubeInfo.edgeLength, cubeInfo.edgeLength);
    const material = new THREE.MeshBasicMaterial( {
        color: color, 
        transparent: true,
        opacity: 0.8,
        side: THREE.BackSide
    } );
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(...cubeInfo.center)

    const edges = new THREE.EdgesGeometry(geometry)
    const lines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial( { color: 0x000000 } ))
    lines.position.set(...cubeInfo.center)
    
    return {
        sides: cube,
        edges: lines
    }
}

export { drawCube };