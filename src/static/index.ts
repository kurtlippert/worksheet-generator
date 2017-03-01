
// css
import '../../node_modules/ace-css/css/ace.css'
import '../../node_modules/font-awesome/css/font-awesome.css'

// get elm
// tslint:disable-next-line:no-var-requires
const Elm = require('../elm/Main')

import { folderContents } from './folder-contents'

// inject the bundled Elm app to div#app
const app = Elm.Main.embed(document.getElementById('app'))

// subscribe to the 'folderContents' port in the ... elm module
app.ports.folderContents.subscribe((srcPath: string) => {
    app.ports.folderContents.send(folderContents(srcPath))
})

