const geometriesData = {
    cube: {
        v: [8, 4, 4],
        params: ["color"]
    },
    line: {
        v: [2, 1, 1],
        params: []
    },
    point: {
        v: [1],
        params: ["p", "q", "factor"]
    }
}
// plane, sphere, cone, box

const paramExps = {
    color: "(color:\\s*)?(#[0-9A-Fa-f]{6}|[A-Za-z]+)"
}

const vertex = "(?:[A-Z](?:[0-9]|')?)|0";
// za sad ne smije biti nikakvih razmaka između vertexa

async function matchExpression(str, exp, msg){
    let match = str.match(exp);
    console.log(match)
    if (!match) 
        return Promise.reject(msg)
    return Promise.resolve(match)
}

function geometries(...geometries){
    let g = "(?<geometry>(";
    for (let i = 0; i < geometries.length; i++){
        g = g + geometries[i] + ")|(";
    }
    g = g + "))";
    return g;
}function functionFormExp(){
    let regex0 = geometries(...Object.keys(geometriesData));
    regex0 = regex0 + "\\s*(?<vertices>[A-Z0-9_']+)\\s*\\((?<params>.*)\\)";
    
    return new RegExp(regex0);
}

function verticesExp(noVertices, ...n){
    let v = "(?<vertices>";
    for (let i = 0; i < n.length; i++){
        v = v 
            + "(?:" + vertex + ")" 
            + "{" + n[i] + "}_?\\s*";
    }
    v = v + ")";
    return new RegExp(v);
}

async function parseFunction(line){
    let tempVertices = "";
    let tempParams = "";
    let command = {geometry: "", vertices: [], params: []};
    try{
        await matchExpression(
            line, 
            functionFormExp(), 
            "No such geometry."
        ).then(res => {
            command.geometry = res.groups.geometry;

            tempVertices = res.groups.vertices;
            tempParams = res.groups.params;
        })
        
        // moglo bi biti problema s argumentima od verticesExp()
        await matchExpression(
            tempVertices, 
            verticesExp(geometriesData[command.geometry].vertices), 
            "Vertices " + tempVertices + " and " + command.geometry + " geometry not compatible."
        ).then(()=>{
            command.vertices = [...tempVertices.matchAll(vertex)].flat()
            // flat() nužan jer [...matchAll()] vraća niz jednočlanih nizova
        })

        for (let p of geometriesData[command.geometry].params){
            await matchExpression(
                tempParams,
                paramExps[p],
                "No " + p + " param."
            ).then((res) =>
                command.params.push(res)
            ) 
        }

        return command

    }catch (err){
        return err;
    }
}

async function parse(source){
    let lines = source.split(/\s*;\s*/);
    let commands = []
    try{
        for (let line of lines.slice(0, -1)){
            if (line.includes("=")){
                await parseEquation(line)
                    .then(res => {
                        commands.push(res)
                    })
            }else{
                await parseFunction(line)
                    .then(res => {
                        commands.push(res)
                    })
            }
        }
    }catch (err){
        //console.log(err)
        return err
    }
    return commands
}

export { parse }