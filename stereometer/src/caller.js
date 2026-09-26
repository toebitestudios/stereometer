import { cube } from "./cube"

function call(geometry, vertices, color){
    
}

var callbacks = {
    cube: cube
}

function renderScene(commands){
    let objects = []
    for (let command of commands){
        // `${command.geometry}`.apply(null, command.color, command.vertices)
        // `${command.geometry}`(command.color, command.vertices);
        // window[func](command.color, command.vertices);
        objects.push(callbacks[command.geometry](command.params.color, ...command.vertices))
    }
    return objects
}

export { renderScene }