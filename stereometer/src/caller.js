import { cube } from "./cube"
import { point } from "./line"
import { splitVertices } from "./parser"

var callbacks = {
    cube: cube,

}

function renderScene(commands){
    let objects = []
    for (let command of commands){
        if (command.geometry)
            objects.push(callbacks[command.geometry](command.params.color, ...command.vertices))
        else if (command.newPoint){
            let [p, q] = splitVertices(command.line);
            objects.push(point(
                command.newPoint, command.factor, p, q
            ))
        }
    }
    return objects
}

export { renderScene }