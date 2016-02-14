var path = require("path");
var Builder = require('systemjs-builder');
var sass = require('node-sass');
var fs = require('fs');

var replaceCSS = function(source, css) {
  return source.replace("{{CSS}}", css.toString('utf8').replace(/\"/g,'\\"').trim());
};

var buildSass = function(js) {
  sass.render({
    file: 'src/codeblock.component.scss',
    outputStyle: 'compressed'
  }, function(error, result) {
    if(!error){
      fs.writeFile('bundle/codeblock.component.js', replaceCSS(js, result.css), function(err){
        if(!err){
          console.log("CSS injected");
        } else {
          console.log("Could not write css to js file");
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
    {format: 'cjs', config: {
      map: {
        "prism": "node_modules/prismjs"
      }
    }})

      .then(function(output) {
        // console.log(output);
        console.log("Javascript bundled");
        buildSass(output.source);
      })

      .catch(function(err) {
        console.log("Build error");
        console.log(err);
      });