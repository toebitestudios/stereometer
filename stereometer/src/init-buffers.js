import * as models from "./models.json"

/**
 * @param {WebGLRenderingContext} gl 
 */

function initBuffers(gl, name, color, edgeLength){
    const data = cubeData(name, color, edgeLength);
    
    const positionBuffer = initPositionBuffer(gl, data.coords);
    const colorBuffer = initColorBuffer(gl);
    const indexBuffer = initIndexBuffer(gl);

    return {
        position: positionBuffer,
        color: colorBuffer,
        indices: indexBuffer,
    };
}

// TO-DO: geometryData
function cubeData(name, color, edgeLength){
    let coords = models.cube.coords
    for (let i = 0; i < coords.length; i++){
        coords[i] *= edgeLength;
    }
        // da ne pišem mali milijun if-elseova,
        // parser će poslati default (ovdje 1) za nenavedene parametre
    let indices = models.cube.indices;
    let colors = null;
    return {
        "coords": coords,
        "indices": indices,
        "colors": colors
    }
}

function initPositionBuffer(gl, coords){
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    
    const cube = [
        // Front face
        -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,

        // Back face
        -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,

        // Top face
        -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,

        // Bottom face
        -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,

        // Right face
        1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,

        // Left face
        -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coords), gl.STATIC_DRAW);

    return positionBuffer;

}

function initColorBuffer(gl){
    const faceColors = [
        [1.0, 1.0, 1.0, 1.0], // Front face: white
        [1.0, 0.0, 1.0, 1.0], // Back face: red
        [0.0, 0.0, 1.0, 1.0], // Top face: green
        [0.0, 0.0, 1.0, 1.0], // Bottom face: blue
        [1.0, 0.0, 0.0, 1.0], // Right face: yellow
        [1.0, 0.0, 0.0, 1.0], // Left face: purple
    ];
    let colors = [];
    for (let c of faceColors){
        colors = colors.concat(c, c, c, c);
    }

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    return colorBuffer;
}

function initIndexBuffer(gl){
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    const indices = [
        0,  1,  2,      0,  2,  3,    // front
        4,  5,  6,      4,  6,  7,    // back
        8,  9,  10,     8,  10, 11,   // top
        12, 13, 14,     12, 14, 15,   // bottom
        16, 17, 18,     16, 18, 19,   // right
        20, 21, 22,     20, 22, 23,   // left
    ];

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    return indexBuffer;
}

export {initBuffers};