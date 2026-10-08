// import { basicSetup } from "codemirror"
// import { EditorView } from "@codemirror/view"
// import { parse } from "./parser"
// import { renderScene } from "./caller"

// const updateListener = EditorView.updateListener.of(update => {
//     if (!update.docChanged) return

//     const source = update.state.doc.toString();
//     if (source[source.length - 1] == "\n"){
//         parse(source).then(
//             (resolve) => {
//                 console.log(resolve)
//                 let objects = renderScene(resolve);
//                 for (let object of objects){
//                     console.log(object)
//                     if (object.geometry == "body"){
//                         scene.add(object.edges)
//                         scene.add(object.sides)
//                     }else if (object.geometry == "point"){
//                         scene.add(object.point)
//                         scene.add(object.line)
//                     }else{
//                         throw new UnexpectedError("name?", "Non existant geometry parsed.")
//                     }
//                 }
//             },
//             (reject) => {
//                 console.log(reject)
//             }
//         )
//     }

    
// })

// const view = new EditorView({
//     doc: "cube ABCD_A1B1C1D1(color: blue);",
//     parent: document.getElementById("code-area"),
//     extensions: [basicSetup, updateListener]
// })

// export { view }