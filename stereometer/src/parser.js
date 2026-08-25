const commandExp = /(?<geometry>(cube)|(line))\s+(?<vertices>[A-Z0-9_]+)\s*\((?<params>.*)\)/s;

const verticesExps = {
    cube: /^(?:[A-Z][0-9]?){4}_?(?:(?:[A-Z][0-9]?){4})?$/g,
    line: /^[A-Z][0-9]?_?[A-Z][0-9]?$/g
}

const paramsExps = {
    //length: /(length:\s*)?[0-9]+(?: [0-9]*\/[0-9]+)?/g,
    color: /(color:\s*)?(#[0-9A-Fa-f]{6}|[A-Za-z]+)/g
}

function splitVertices(str){
    let vertices = [];
    for (let i = 0; i < str.length; i++){
        (/[0-9]/.test(str[i])) ? vertices[vertices.length-1] += str[i] : vertices.push(str[i])
    }
    return vertices
}

async function matchExpression(str, exp, msg){
    let match = str.match(exp);
    if (!match) 
        return Promise.reject(msg)
    return Promise.resolve(match)
}

async function parse(source){
    let lines = source.split(/\s*;\s*/);
    let commands = [];
    // ne treba i temp i current 
    // (jer je Object pass by reference pa ionako moram stvarati novoga)
    let tempCommand = {geometry: "", vertices: "", params: []};
    let currentCommand = {geometry: "", 
        vertices: [], 
        params: {
            //length: 1,
            color: "white"
        }};
    let params = Object.entries(paramsExps);
    for (let line of lines.slice(0,-1)){
        try{

            await matchExpression(
                line, commandExp, "No such geometry."
            ).then(res => {
                currentCommand.geometry = res.groups.geometry;
                tempCommand = res.groups;
                tempCommand.params = tempCommand.params.split(/\s*,\s*/);
            })

            for (let g in verticesExps){
                if (currentCommand.geometry == g){
                    await matchExpression(
                        tempCommand.vertices, verticesExps[g], 
                        "Vertices " + tempCommand.vertices + " and " + g + " geometry not compatible."
                    ).then(res => {
                        currentCommand.vertices = splitVertices(res[0].split("_").join(""))
                    })
                    break;
                }
            }    

            if (tempCommand.params[0] != ""){
                for (let i = 0; i < tempCommand.params.length; i++){
                    await matchExpression(
                        tempCommand.params[i], params[i][1], "Wrong " + params[i][0] + " parameter."
                    ).then(res => {
                        res = res[0].split(/\s*:\s*/);
                        res[1] ? 
                            currentCommand.params[params[i][0]] = res[1]
                            : currentCommand.params[params[i][0]] = res[0];
                        
                    })
                }
            }

            commands.push(
                {
                    geometry: currentCommand.geometry,
                    vertices: currentCommand.vertices,
                    params: currentCommand.params
                }
            )

        }catch(err){
            console.log(err)
        }
    }
    return commands
    //console.log(commands)
}

export { parse }