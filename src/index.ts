// get elm
// tslint:disable-next-line:no-var-requires
const Elm = require('./Main')

// inject the bundled Elm app to div#root
const app = Elm.Main.embed(document.getElementById('root'))
