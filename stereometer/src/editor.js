import { basicSetup } from "codemirror"
import { EditorView } from "@codemirror/view"

const view = new EditorView({
    doc: "",
    parent: document.getElementById("code-area"),
    extensions: [basicSetup]
})