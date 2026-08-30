import * as THREE from 'three'
import { world } from './world'

function newPoint(name, factor, p, q){
    if (Object.hasOwn(world, name)){ 
        throw new Error("Point " + name + " already exists.");
        return;
    }

    let newP = [0, 0, 0];
    for (let i = 0; i < 3; i++){
        newP[i] = world[p][i] + factor * (world[q][i] - world[p][i]);
    }
    world[name] = newP
    return newP

}

export { newPoint }