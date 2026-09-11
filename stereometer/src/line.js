import * as THREE from 'three'
import { world } from './world'

function newLine(p, q){
    
}

function newPoint(name, factor, p, q){
    if (Object.hasOwn(world.points, name)){ 
        throw new Error("Point " + name + " already exists.");
        return;
    }

    let newP = new Float32Array(3);
    for (let i = 0; i < 3; i++){
        newP[i] = world.points[p][i] + factor * (world.points[q][i] - world.points[p][i]);
    }
    world.points[name] = newP

    const pointGeom = new THREE.BufferGeometry()
    pointGeom.setAttribute('position', new THREE.BufferAttribute(newP, 3));
    const pointMat = new THREE.PointsMaterial({color: 0x000000, size: 0.1, sizeAttenuation: true});
    const point = new THREE.Points(pointGeom, pointMat)

    const lineMat = new THREE.LineBasicMaterial({color: 0x000000});
    const lineGeom = new THREE.BufferGeometry().setFromPoints(
        [new THREE.Vector3(
            world.points[p][0],
            world.points[p][1],
            world.points[p][2]), 
        new THREE.Vector3(
            world.points[q][0],
            world.points[q][1],
            world.points[q][2])])
    const line = new THREE.Line(lineGeom, lineMat);

    return {
        point: point,
        line: line
    }
}

export { newPoint }