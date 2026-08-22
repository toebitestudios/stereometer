import { basicSetup } from "codemirror"
import { EditorView } from "@codemirror/view"

const updateListener = EditorView.updateListener.of(update => {
    if (!update.docChanged) return

    const source = update.state.doc.toString();

    console.log(source)
})

const view = new EditorView({
    doc: "cube(ABCD, \n1,#00ff00,)",
    parent: document.getElementById("code-area"),
    extensions: [basicSetup, updateListener]
})

export { view }