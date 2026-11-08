import { AbstractGeometry, Geometry } from './classes'

const abstractCube = new AbstractGeometry(
    "cube",
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
    "scalars"
)

function cube(color, ...verticesNames){
    let cube = new Geometry("cube", verticesNames, abstractCube.vectorCoords, {color: color})
    return{
        geometry: "body", 
        sides: cube.sides,
        edges: cube.edges
    }
}

export { cube };