import * as THREE from 'three'

function noVertices(geometry){
    switch (geometry){
        case "cube":
            return 8    
        case "line":
            return 2
        default:
            throw new GeometryError(`No ${geometry} geometry.`)
    }
}

function toVectors(coords){
    let l = coords.length
    if (l%3 !== 0)
        throw new Error("Coords length must be a multiple of three (thre values (x, y, z) represent a single point in space.")
    let vectorsArray = []
    for (let i = 0; i < l; i = i + 3){
        vectorsArray.push(THREE.Vector3.fromArray(coords, i))
    }
    return vectorsArray
}

function toScalars(vectors){
    let l = vectors.length
    let scalarsArray = [];
    for (let i = 0; i < l; i++){
        vectors[i].toArray(scalarsArray) // treba li offset?
    }
    return scalarsArray;
}

class GeometryError extends Error{
    constructor(message){
        super(message);
    }
}

class Geometry{

    constructor(geometry, vertices){
        let noV = noVertices(geometry);
        if (vertices.length == noV){
            this.vertices = vertices;
            this.params = {};
        }else
            throw new GeometryError(`${noV} vertices not compatible with ${geometry} geometry.`);
    }

    setParam(param, value){
        this.params[param] = value
    }

}

class AbstractGeometry{

    constructor(geometry, coords, option){
        let noV = noVertices(geometry)
        if (option == "vectors"){
            if (noV !== coords.length)
                throw new GeometryError(`AbstractGeometry Error: Number of vertices required for ${geometry} (${noV}) does not match the length of given option (${option}) and coordinates - ${coords}.`)
            this.vectorCoordsArray = coords
            this.scalarCoordsArray = toScalars(coords)
        }else if (option == "scalars"){
            if (noV*3 !== coords.length)
                throw new GeometryError(`AbstractGeometry Error: Number of vertices required for ${geometry} (${noV}) does not match the length of given option (${option}) and coordinates - ${coords}.`)
            this.scalarCoordsArray = coords
            this.vectorCoordsArray = toVectors(coords)
        }       
    }

    setEdges(edges){
        console.log("setEdges() not implemented yet.")
    }

    setSides(sides){
        console.log("setEdges() not implemented yet.")
    }

}