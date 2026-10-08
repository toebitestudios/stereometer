import * as THREE from 'three'
import { world } from './world'

function newLine(p, q){
    
}

function point(name, factor, p, q){
    if (Object.hasOwn(world.points, name)){ 
        throw new Error("Point " + name + " already exists.");
        return;
    }

    factor = eval(scriptPolicy.createScript(factor))
    // pazi na eval !!!

    let newP = new Float32Array(3);
    for (let i = 0; i < 3; i++){
        newP[i] = world.points[p][i] + factor * (world.points[q][i] - world.points[p][i]);
    }
    world.points[name] = newP

    const pointGeom = new THREE.BufferGeometry()
    pointGeom.setAttribute('position', new THREE.BufferAttribute(newP, 3));
    const pointMat = new THREE.PointsMaterial({color: 0x000000, size: 0.075, sizeAttenuation: true});
    const point = new THREE.Points(pointGeom, pointMat)

    const lineMat = new THREE.LineBasicMaterial({color: 0x000000});

    let fromPoints = [];
    if (factor >= 0 && factor <= 1){
        fromPoints.push(new THREE.Vector3(
            world.points[p][0],
            world.points[p][1],
            world.points[p][2])
        );
        fromPoints.push(new THREE.Vector3(
            world.points[q][0],
            world.points[q][1],
            world.points[q][2])
        );
    }else if (factor > 1){
        fromPoints.push(new THREE.Vector3(
            world.points[p][0],
            world.points[p][1],
            world.points[p][2])
        );
        fromPoints.push(new THREE.Vector3(
            newP[0],
            newP[1],
            newP[2])
        );
    }else{
        fromPoints.push(new THREE.Vector3(
            world.points[q][0],
            world.points[q][1],
            world.points[q][2])
        );
        fromPoints.push(new THREE.Vector3(
            newP[0],
            newP[1],
            newP[2])
        );
    }

    const lineGeom = new THREE.BufferGeometry().setFromPoints(fromPoints)
    const line = new THREE.Line(lineGeom, lineMat);

    return {
        geometry: "point",
        point: point,
        line: line
    }
}

export { point }