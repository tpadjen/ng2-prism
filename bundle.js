var path = require("path");
var Builder = require('systemjs-builder');
var sass = require('node-sass');
var fs = require('fs');

var buildSass = function() {
  sass.render({
    file: 'src/codeblock.component.scss'
  }, function(error, result) {
    if(!error){
      fs.writeFile('bundle/codeblock.component.css', result.css, function(err){
        if(!err){
          console.log("CSS compiled");
        } else {
          console.log("Could not write css file");
          console.log(err);  
        }
      });
    } else {
      console.log("Sass compilation error");
      console.log(error);
    }
  });
};


var builder = new Builder('.', './config.js');

builder.buildStatic('bundle/codeblock.component.js', 
    'bundle/codeblock.component.js', 
    {format: 'cjs', config: {
      map: {
        "prism": "node_modules/prismjs"
      }
    }})

      .then(function() {
        console.log("Javascript bundled");
        buildSass();
      })

      .catch(function(err) {
        console.log("Build error");
        console.log(err);
      });