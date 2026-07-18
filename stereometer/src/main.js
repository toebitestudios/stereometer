import { initBuffers } from "./init-buffers"
import { drawScene } from "./draw-scene"

/**
 * @param {WebGLRenderingContext} gl
 */

const INERTION = true;

let rotationX = 0, rotationY = 0, rotationZ = 0;
let radius = 5;

main();

function main(){
    const canvas = document.createElement("canvas");

    let rect = document.getElementById("draw-area").getBoundingClientRect();
    //let w = document.getElementById("draw-area").offsetWidth;
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    const gl = canvas.getContext("webgl");
    if (gl == null){
        alert("Unable to initialize WebGL. Your browser or machine may not support it.", );
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const vsSource = /*glsl*/`
        attribute vec4 aVertexPosition;
        attribute vec4 aVertexColor;

        uniform mat4 uModel;
        uniform mat4 uView;
        uniform mat4 uProjection;

        varying lowp vec4 vColor;

        void main(){
            gl_Position = uProjection * uView * uModel * aVertexPosition;
            vColor = aVertexColor;
        }
    `;

    const fsSource = /*glsl*/`
        varying lowp vec4 vColor;
        
        void main() {
            gl_FragColor = vColor;
        }
    `;

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    const programInfo = {
        program: shaderProgram,
        attribLocations:{
            vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
            vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
        },
        uniformLocations:{
            projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjection"),
            viewMatrix: gl.getUniformLocation(shaderProgram, "uView"),
            modelMatrix: gl.getUniformLocation(shaderProgram, "uModel"),
        },
    }

    const buffers = initBuffers(gl, "The only cube", "red", 0.75);

    function render(movementX, movementY){
        rotationX += movementX * 0.01
        rotationY += movementY * 0.01;
        drawScene(gl, programInfo, buffers, radius, rotationX, rotationY);
    }

    canvas.onmousedown = function (e) {
        canvas.onmousemove = function (f) {
            requestAnimationFrame(function() {
                render(f.movementX, f.movementY)
            }); 
        }
    }
    canvas.onmouseup = function (e) {
        canvas.onmousemove = function (f) {
            requestAnimationFrame(function() {
                render(0, 0)
            }); 
        }
    }
    canvas.onmouseleave = function (e) {
        canvas.dispatchEvent(new MouseEvent("mouseup"));
        requestAnimationFrame(function() {
            render(0, 0)
        });
    }
 
    canvas.onwheel = function (e){
        radius += 0.5 * Math.sign(e.deltaY);
        requestAnimationFrame(function() {
            render(0, 0)
        });
    }

    requestAnimationFrame(function() {
        render(0, 0)
    });
    
    document.getElementById("draw-area").appendChild(canvas);

}

function initShaderProgram(gl, vSource, fSource){
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)){
        alert(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram,)}`,);
        return null;
    }

    return shaderProgram;
}

function loadShader(gl, type, source){
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`,);
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}