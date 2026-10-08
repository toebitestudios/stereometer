const world = {
    points: {
        0: new Float32Array([0, 0, 0]),
    },
    lines: {

    },
    planes: {

    },

    toString(){
        let s = "Points:\n"
        for (let p of Object.entries(this.points)){
            s = s + "\t" + p[0] + ": " + p[1] + "\n"
        }
        s = s + "Lines:\n"
        for (let p of Object.entries(this.lines)){
            s = s + "\t" + p[0] + ": " + p[1] + "\n"
        }    
        s = s + "Planes:\n"
        for (let p of Object.entries(this.planes)){
            s = s + "\t" + p[0] + ": " + p[1] + "\n"
        }        
        return s
    }
}

export { world }