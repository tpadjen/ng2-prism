var path = require("path");
var Builder = require('systemjs-builder');

var builder = new Builder('.', './config.js');

builder.buildStatic('src/codeblock.component.ts', 
    'bundle/codeblock.component.js', 
    {format: 'cjs'})

      .then(function() {
        console.log("Bundle complete");
      })

      .catch(function(err) {
        console.log("Build error");
        console.log(err);
      })