const vertex = "(?:(?:(?:[A-Z](?:[0-9]|')?)|0)\\s*)";

function genVerticesExp(noVertices, ...delimiterPositions){
    let verticesExp = "^(?<vertices>";
    let l = delimiterPositions.length
    let j = 0;
    for (let i = 0; i < l; i++){
        verticesExp = verticesExp + vertex + "{" + delimiterPositions[i-j] + "}_?\\s*"
        j = i;
    }
    verticesExp = verticesExp + ")$";
    return new RegExp(verticesExp);
}

export { genVerticesExp }