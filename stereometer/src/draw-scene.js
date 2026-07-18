import { mat4 } from "gl-matrix"

/**
 * @param {WebGLRenderingContext} gl
 */

function drawScene(gl, programInfo, buffers, radius, rotationX, rotationY){
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const fieldOfView = ( 45 * Math.PI ) / 180.0;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    const viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix, [-rotationX*radius, rotationY*radius, radius], [0, 0, 0], [0, 1, 0]);
        // ovo se i udaljava i približava kako se okreće
        // <= kružnica kojoj je središte u [0, 0, radius]
        
    // mat4.translate(viewMatrix, viewMatrix, [0.0, 0.0, -radius]);
    // mat4.rotate(viewMatrix, viewMatrix, rotationX, [0, 1, 0]);
    // mat4.rotate(viewMatrix, viewMatrix, rotationY, [1, 0, 0]);
    //mat4.rotate(viewMatrix, viewMatrix, rotationZ, [0, 0, 1]);

    /* const cameraPos = vec3.fromValues(0, 0, -radius);
        // pozicija kamere se mijenja, očito
    const cameraTarget = vec3.fromValues(0, 0, 0);
        // uvijek će biti ishodište*, imenovano je da znam
        // *TO-DO: da se može promijeniti u kodu
    const cameraDirection = vec3.normalize(
        vec3.subtract(cameraPos, cameraTarget));
    const worldUp = vec3.fromValues(0, 1, 0);
    const cameraUp = vec3.normalize(
        vec3.cross(worldUp, cameraDirection));
    const cameraUp = vec3.cross(cameraDirection, cameraRight); */

    

    const modelMatrix = mat4.create();
        // identitetna matrica
    //mat4.rotate(modelMatrix, modelMatrix, rotation, [1, 1, 1])
    
    setPositionAttribute(gl, buffers, programInfo);
    setColorAttribute(gl, buffers, programInfo);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
    gl.useProgram(programInfo.program);
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix
    )
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.viewMatrix,
        false,
        viewMatrix
    )
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelMatrix,
        false,
        modelMatrix
    )

    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);

}

function setPositionAttribute(gl, buffers, programInfo){
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}

function setColorAttribute(gl, buffers, programInfo){
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexColor, 4, gl.FLOAT, false, 0, 0,);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
}

export {drawScene};