import * as THREE from 'three'
import { world } from './world'

function round(vec){
    return new THREE.Vector3(
        Number(vec.x.toFixed(3)),
        Number(vec.y.toFixed(3)),
        Number(vec.z.toFixed(3))
    )
}

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
    let v = new THREE.Vector3(0, 0, 0);
    for (let i = 0; i < l; i = i + 3){
        v.fromArray(coords, i)
        vectorsArray.push(v.clone())
    }
    console.log(vectorsArray)
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

function findLines(vertices, avs){
    // vertices = names, avs = abstract vectors array
    let vp, vq, // coords (vec) of points already in the world
        p, q,   // ordinals of those points in geometry
        ap, aq; // coords of abstract shape on that ords
    let v;
    let flag = -1;
    for (let i = 0; i < vertices.length; i++){
        v = world.points[vertices[i]]
        if (v !== undefined){
            if (++flag){
                p = i
                vp = new THREE.Vector3(...v)
                ap = avs[i]
            }else{
                q = i; 
                vq = new THREE.Vector3(...v)
                aq = avs[i]
                break;
            }
        }
    }

    return{
        p, q, vp, vq, ap, aq
    }
}

function transformMatrix({p, q, vp, vq, ap, aq}){
    let T = new THREE.Vector3(0, 0, 0);
    let R = new THREE.Quaternion(0, 0, 0, 0);
    let S = new THREE.Vector3(1.0, 1.0, 1.0);

    let transform = new THREE.Matrix4();

    if (p === undefined){
    }else if (q === undefined){
        T = ap.clone().sub(vp)
    }else{
        let pTOq = vp.clone().sub(vq);
        let apTOaq = ap.clone().sub(aq);

        let s = pTOq.length() / apTOaq.length();
        S.set(s, s, s);
        //
        apTOaq.multiply(S);

        R.setFromUnitVectors(
            apTOaq.clone().normalize(),
            pTOq.clone().normalize()
        )
        //
        apTOaq.applyQuaternion(R);

        T = p.clone().sub(ap.multiply(scale).applyQuaternion(R))
    }
    transform.compose(T, R, S);
    return transform
}

function genCoords(vertices, avs){
    let transform = transformMatrix(findLines(vertices, avs))

    let vectorCoords = [];
    let scalarCoords = [];
    let temp = new THREE.Vector3();
    for (let i = 0; i < vertices.length; i++){
        temp = round(avs[i].clone().applyMatrix4(transform));
        vectorCoords.push(temp);
        scalarCoords.push(...temp);
        if (!world.points[vertices[i]]){
            world.points[vertices[i]] = [...temp];
            // DODAJ ili PROMJENI da su točke vektori
        }
    }

    return {
        vectorCoords, scalarCoords, transform
    }
}

class GeometryError extends Error{
    constructor(message){
        super(message);
    }
}


class AbstractGeometry{

    setCoords(coords, option){
        let noV = noVertices(this.geometry)
        if (option == "vectors"){
            if (noV !== coords.length)
                throw new GeometryError(`AbstractGeometry Error: Number of vertices required for ${this.geometry} (${noV}) does not match the length of given option (${option}) and coordinates - ${coords}.`)
            this.vectorCoords = coords
            this.scalarCoords = toScalars(coords)
        }else if (option == "scalars"){
            if (noV*3 !== coords.length)
                throw new GeometryError(`AbstractGeometry Error: Number of vertices required for ${this.geometry} (${noV}) does not match the length of given option (${option}) and coordinates - ${coords}.`)
            this.scalarCoords = coords
            this.vectorCoords = toVectors(coords)
        }
    }

    constructor(geometry, coords, option){
        this.geometry = geometry 
        if (option == "vectors" || option == "scalars")  
            this.setCoords(coords, option) 
    }

    setEdges(edges){
        console.log("setEdges() not implemented yet.")
    }

    setSides(sides){
        console.log("setEdges() not implemented yet.")
    }

}

class Geometry extends AbstractGeometry{

    geom3D(transform, params){
        const geometry = new THREE.BoxGeometry();
        geometry.applyMatrix4(transform);
        const material = new THREE.MeshBasicMaterial({
            color: params.color,
            transparent: true,
            opacity: 0.5, // params
            side: THREE.BackSide
        });
        const sides = new THREE.Mesh(geometry, material);
        const edgesGeom = new THREE.EdgesGeometry(geometry);
        const lines = new THREE.LineSegments(edgesGeom,
            new THREE.LineBasicMaterial({
                color: 0x000000,
                fog: false
            })
        )

        return{ sides: sides, edges: lines}
    }

    constructor(geometry, vertices, avs, params){
        let noV = noVertices(geometry);
        if (vertices.length == noV){
            let {vectorCoords, scalarCoords, transform} = genCoords(vertices, avs)
            super(geometry, vectorCoords, "vectors");
            this.vertices = vertices;
            this.params = params;
            let {sides, edges} = this.geom3D(transform, params)
            this.sides = sides;
            this.edges = edges;
        }else
            throw new GeometryError(`${noV} vertices not compatible with ${geometry} geometry.`);
    }

    setParam(param, value){
        this.params[param] = value
    }
    
}

export { AbstractGeometry, Geometry }