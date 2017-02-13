'use strict'

// css
require('../../node_modules/ace-css/css/ace.css');
require('../../node_modules/font-awesome/css/font-awesome.css');
//require('../../node_modules/semantic-ui-css/semantic.css');

// get elm
var Elm = require('../elm/Main');

// inject the bundled Elm app to div#app
var app = Elm.Main.embed(document.getElementById('app'));

// subscribe to the 'alert' port in the HttpTest elm module
//app.ports.alert.subscribe(function(message) {
//    browserAlert(message)
//});
//
//function browserAlert(msg) {
//    alert(msg);
//}
