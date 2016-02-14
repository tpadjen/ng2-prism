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
          console.log("Sass compilation error");
          console.log(err);
        }
      });
    }
  });
};


var builder = new Builder('.', './config.js');

builder.buildStatic('bundle/codeblock.component.js', 
    'bundle/codeblock.component.js', 
    {format: 'cjs'})

      .then(function() {
        console.log("Javascript bundled");
        buildSass();
      })

      .catch(function(err) {
        console.log("Build error");
        console.log(err);
      });