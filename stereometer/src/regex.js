const vertex = "(?:[A-Z](?:[0-9]|')?)|0";
// za sad ne smije biti nikakvih razmaka između vertexa
function verticesExp(verticesGroups, name = "vertices", ){
    let v = "(?<" + name + ">";
    for (let i = 0; i < verticesGroups.length; i++){
        v = v 
            + "(?:" + vertex + ")" 
            + "{" + verticesGroups[i] + "}_?\\s*";
    }
    v = v + ")";
    return {
        r: new RegExp(v),
        s: v
    }
}

const geometriesData = {
    cube: {
        v: [4, 4],
        params: ["color"]
    },
}
const paramExps = {
    color: "(color:\\s*)(#[0-9A-Fa-f]{6}|[A-Za-z]+)"
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

const equationsData = {
    pointFromLine: {
        left: verticesExp([1], "point").r,
        right: new RegExp("(?<factor>[0-9]*\\.?[0-9]+)\\s*\\*\\s*" 
            + verticesExp([1, 1], "line").s)
    },  
}


// plane, sphere, cone, box

async function matchExpression(str, exp, msg){
    let match = str.match(exp);
    //console.log(match)
    if (!match) 
        return Promise.reject(msg)
    return Promise.resolve(match)
}

async function parseFunction(line){
    let tempVertices = "";
    let tempParams = "";
    let command = {geometry: "", vertices: [], params: {}};
    try{
        await matchExpression(line, functionFormExp(), "No such geometry.")
        .then(res => {
            command.geometry = res.groups.geometry;

            tempVertices = res.groups.vertices;
            tempParams = res.groups.params;
        })
        
        // moglo bi biti problema s argumentima od verticesExp()
        await matchExpression(tempVertices, verticesExp(geometriesData[command.geometry].v).r, "Vertices " + tempVertices + " and " + command.geometry + " geometry not compatible.")
        .then(()=>{
            command.vertices = [...tempVertices.matchAll(vertex)].flat()
            // flat() nužan jer [...matchAll()] vraća niz jednočlanih nizova
        })

        for (let p of geometriesData[command.geometry].params){
            await matchExpression(tempParams, paramExps[p],"No " + p + " param.")
            .then((res) => {
                res = res[0].split(/\s*:\s*/);
                command.params[res[0]] = res[1];
            }) 
        }

        return command

    }catch (err){
        console.log(err)
        return err;
    }
}

async function parseEquation(line){
    let lr = line.split(/\s*=\s*/);
    let left, right;
    try{
        for (let eqs of Object.entries(equationsData)){
            left = lr[0].match(eqs[1].left)
            right = lr[1].match(eqs[1].right)
            //console.log(lr[1].match(eqs[1].right))
            if (left && right) break
        }
        if (!left || !right){
            throw new Error("Equation wrong - temp message.")
        }
    }catch(err){
        return err
    }
    return {
        point: left.groups.point,
        factor: right.groups.factor,
        line: right.groups.line
    }
}

async function parse(source){
    let lines = source.split(/\s*;\s*/);
    let commands = []
    try{
        for (let line of lines.slice(0, -1)){
            if (line.includes("="))
                await parseEquation(line).then(res => {commands.push(res)})
            else
                await parseFunction(line).then(res => {commands.push(res)})
        }
    }catch (err){
        //console.log(err)
        return err
    }
    return commands
}

export { parse }