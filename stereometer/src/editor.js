import { basicSetup } from "codemirror"
import { EditorView } from "@codemirror/view"
import { parse } from "./parser"

const updateListener = EditorView.updateListener.of(update => {
    if (!update.docChanged) return

    const source = update.state.doc.toString();
    if (source[source.length - 1] == ";"){
        parse(source).then(
            (resolve) => {
                console.log(resolve)
            },
            (reject) => {
                console.log(reject)
            }
        )
    }

    
})

const view = new EditorView({
    doc: "cube ABCDA1B1C1D1();",
    parent: document.getElementById("code-area"),
    extensions: [basicSetup, updateListener]
})

export { view }