// css
import './semantic.css'

// get elm
// tslint:disable-next-line:no-var-requires
const Elm = require('./app/Main')

// inject the bundled Elm app to div#root
Elm.Main.embed(document.getElementById('root'))
