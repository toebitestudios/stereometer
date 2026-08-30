import { world } from './world'
import { Text } from 'troika-three-text'

function rednerPoints(){
    const names = [];
    for (let p of Object.entries(world)){
        names.unshift(new Text())
        names[0].text = p[0];
        names[0].position.set(p[1][0],p[1][1], p[1][2])
        names[0].color = 0x000000;
        names[0].fontSize = 0.2;
    }
    return names
}

export { rednerPoints };