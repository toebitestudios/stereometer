import * as THREE from 'three'
import { world } from './world'

const abstractCube = {
    center: new THREE.Vector3(0, 0, 0),
    edgeLength: 2.0,

    verticesArray: 
    [
        -0.5, -0.5, 0.5,
        0.5, -0.5, 0.5, 
        0.5, -0.5, -0.5,
        -0.5, -0.5, -0.5,

        -0.5, 0.5, 0.5,
        0.5, 0.5, 0.5, 
        0.5, 0.5, -0.5,
        -0.5, 0.5, -0.5
    ],
    verticesVectorsArray:
    [
        new THREE.Vector3(-0.5, -0.5, 0.5),
        new THREE.Vector3(0.5, -0.5, 0.5), 
        new THREE.Vector3(0.5, -0.5, -0.5),
        new THREE.Vector3(-0.5, -0.5, -0.5),

        new THREE.Vector3(-0.5, 0.5, 0.5),
        new THREE.Vector3(0.5, 0.5, 0.5), 
        new THREE.Vector3(0.5, 0.5, -0.5),
        new THREE.Vector3(-0.5, 0.5, -0.5)
    ],
    edgesArray: 
    [
        0, 1, 1, 2, 2, 3, 3, 1,
        
        1, 4, 2, 5, 3, 6, 4, 7,

        4, 5, 5, 6, 6, 7, 7, 4
    ],
    sidesArray: 
    [
        0, 1, 2, 3,

        0, 1, 4, 5,
        1, 2, 5, 6,
        2, 3, 6, 7,
        3, 1, 7, 4,

        4, 5, 6, 7
    ]
};

function round(vec){
    return new THREE.Vector3(
        Number(vec.x.toFixed(3)),
        Number(vec.y.toFixed(3)),
        Number(vec.z.toFixed(3))
    )
}

function findLines(vertices){
    let cubePoints = [];
    let lines = []; // == existing points
    for (let i = 0; i < 8; i++){
        if (world.points[vertices[i]]){
            cubePoints.push(...world.points[vertices[i]])
            lines.push(i)
        }else{
            cubePoints.push(null, null, null)
        }
    }

    return {
        cubePoints: cubePoints,
        lines: lines
    }
}

function getTransform(lines, cubePoints){
    let translation = new THREE.Vector3(0, 0, 0);
    let rotation = new THREE.Quaternion(0, 0, 0, 0);
    let scale = new THREE.Vector3(1.0, 1.0, 1.0);

    let transform = new THREE.Matrix4();

    let p = lines[0];
    let q = lines[1];

    if (p === undefined){ }
    else if (q === undefined){
        let currentP = new THREE.Vector3(
            cubePoints[3*p + 0],
            cubePoints[3*p + 1],
            cubePoints[3*p + 2],
        )
        let abstractP = new THREE.Vector3(
            abstractCube.verticesArray[3*p + 0],
            abstractCube.verticesArray[3*p + 1],
            abstractCube.verticesArray[3*p + 2],
        )

        translation = abstractP.clone().sub(currentP)
    }else{
        let currentP = new THREE.Vector3(
            cubePoints[3*p + 0],
            cubePoints[3*p + 1],
            cubePoints[3*p + 2],
        )
        let abstractP = new THREE.Vector3(
            abstractCube.verticesArray[3*p + 0],
            abstractCube.verticesArray[3*p + 1],
            abstractCube.verticesArray[3*p + 2],
        )

        let currentQ = new THREE.Vector3(
            cubePoints[3*q + 0],
            cubePoints[3*q + 1],
            cubePoints[3*q + 2],
        )
        let abstractQ = new THREE.Vector3(
            abstractCube.verticesArray[3*q + 0],
            abstractCube.verticesArray[3*q + 1],
            abstractCube.verticesArray[3*q + 2],
        )

        let current = currentP.clone().sub(currentQ);
        let abstract = abstractP.clone().sub(abstractQ);

        let s = current.length() / abstract.length();
        scale.set(s, s, s);
        abstract.multiply(scale);

        rotation.setFromUnitVectors(
            abstract.clone().normalize(),
            current.clone().normalize()
        )
        abstract.applyQuaternion(rotation);

        translation = currentP.sub(
            abstractP.multiply(scale).applyQuaternion(rotation)
        )

        // console.log("T: ", translation)
        // console.log("R: ", rotation)
        // console.log("S: ", scale)
        
    }

    transform.compose(translation, rotation, scale)
    return transform
}

function generateCubeCoords(...vertices){
    let lines = findLines(vertices);
    let transform = getTransform(lines.lines, lines.cubePoints);

    let coords = []
    let temp = new THREE.Vector3();
    for (let i = 0; i < 8; i++){
        temp = round(
            abstractCube.verticesVectorsArray[i].clone().applyMatrix4(transform)
        );
        coords.push(...temp)
        if (!world.points[vertices[i]]){ 
            world.points[vertices[i]] = [
                temp.x, temp.y, temp.z
            ]
        }
    }
    
    return transform

}

// front/back side, fog/fogexp2 s raznim parametrima, opacity, css background
// -> za najbolji izgled
// => fog: on/off da korisnik može

function drawCube(color, ...verticesNames){
    let transform = generateCubeCoords(...verticesNames);
    const geometry = new THREE.BoxGeometry();
    geometry.applyMatrix4(transform)
    const material = new THREE.MeshBasicMaterial( {
        color: color, 
        transparent: true,
        opacity: 0.75,
        side: THREE.BackSide
    } );
    const cube = new THREE.Mesh(geometry, material);
    const edges = new THREE.EdgesGeometry(geometry)
    const lines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial( { color: 0x000000 } ))

    return {
        sides: cube,
        edges: lines
    }
}

export { drawCube };