import * as THREE from 'three'
import { world } from './world'

const abstractCube = {
    center: new THREE.Vector3(0, 0, 0),
    edgeLength: 2.0,

    verticesArray: 
    [
        -1, -1, 1,
        1, -1, 1, 
        1, -1, -1,
        -1, -1, -1,

        -1, 1, 1,
        1, 1, 1, 
        1, 1, -1,
        -1, 1, -1
    ],
    verticesVectorsArray:
    [
        new THREE.Vector3(-1, -1, 1),
        new THREE.Vector3(1, -1, 1), 
        new THREE.Vector3(1, -1, -1),
        new THREE.Vector3(-1, -1, -1),

        new THREE.Vector3(-1, 1, 1),
        new THREE.Vector3(1, 1, 1), 
        new THREE.Vector3(1, 1, -1),
        new THREE.Vector3(-1, 1, -1)
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

    //console.log(cubePoints, lines)
    // OK

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

        console.log("T: ", translation)
        console.log("R: ", rotation)
        console.log("S: ", scale)
        
    }

    transform.compose(translation, rotation, scale)
    return transform
}

function getTransform2(lines, cubePoints){
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

        let tempScale = 
            (currentP.clone().sub(currentQ)).length()
            /
            (abstractP.clone().sub(abstractQ)).length()

        let localCenter = new THREE.Vector3()
        localCenter = currentP.clone().sub(abstractP.clone().multiplyScalar(tempScale))

        translation = localCenter.clone()//.multiplyScalar(-1.0);

        rotation.setFromUnitVectors(
            abstractP.clone().normalize(),
            localCenter.clone().sub(currentP).normalize()
        )

        console.log("T: ", translation)
        console.log("R: ", rotation)
        console.log("S: ", scale)
        
    }

    transform.compose(translation, rotation, scale)
    return transform
}

// pronađi dužine => pronađi dužine pod "tim" rednim rojem u apstraktnoj kocki
function getTransform1(lines, cubePoints){
    let translation = new THREE.Vector3(0, 0, 0);
    let rotation = new THREE.Quaternion(0, 0, 0, 0);
    let scale = new THREE.Vector3(1.0, 1.0, 1.0);

    let p = lines[0]
    if (p !== undefined){
        let a0 = abstractCube.verticesArray[p*3 + 0]
        let a1 = abstractCube.verticesArray[p*3 + 1]
        let a2 = abstractCube.verticesArray[p*3 + 2]
        let aa0 = cubePoints[p*3 + 0]
        let aa1 = cubePoints[p*3 + 1]
        let aa2 = cubePoints[p*3 + 2]

        console.log("T: ", translation)
        console.log("R: ", rotation)
        console.log("S: ", scale)

        p = lines[1]
        if (p !== undefined){
            let b0 = abstractCube.verticesArray[p*3 + 0]
            let b1 = abstractCube.verticesArray[p*3 + 1]
            let b2 = abstractCube.verticesArray[p*3 + 2]
            let bb0 = cubePoints[p*3 + 0]
            let bb1 = cubePoints[p*3 + 1]
            let bb2 = cubePoints[p*3 + 2]

            let bb = new THREE.Vector3(
                bb0 - aa0, bb1 - aa1, bb2 - aa2
            )
            let b = new THREE.Vector3(
                b0 - a0, b1 - a1, b2 - a2
            )

            console.log("bb: ", bb)
            console.log("b: ", b)

            scale = scale.multiplyScalar(bb.length()/b.length())
            b.multiplyVectors(b, scale);

            console.log("b * S: ", b)

            rotation = new THREE.Quaternion()
            rotation.setFromUnitVectors(
                b.normalize(),
                bb.normalize()
            )            
            b.applyQuaternion(rotation)

            console.log("b * R: ", b)

            //console.log("S: ", scale)
            //console.log("R: ", rotation)
            // OK

            // TRANSLACIJA SREDIŠTA!!!
            translation = new THREE.Vector3(
                bb0 - b0, 
                bb1 - b1, 
                bb2 - b2
            )
            b.sub(translation)

            console.log("b * T: ", b)

            //console.log("T: ", translation)
            // OK
        }
    }

    let transform =  new THREE.Matrix4();
    transform.compose(translation, rotation, scale);
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
    
    console.log(coords)
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
    cube.applyMatrix4(transform);
    //cube.position.set(...cubeInfo.center)
    const edges = new THREE.EdgesGeometry(geometry)
    const lines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial( { color: 0x000000 } ))
    //lines.position.set(...cubeInfo.center)
    
    console.log(world)

    return {
        sides: cube,
        edges: lines
    }
}

export { drawCube };