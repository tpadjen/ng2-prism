let sass = require('node-sass');
let fs = require('fs');

let buildSass = function (js) {
  sass.render({
    file: 'src/codeblock.component.scss',
    outputStyle: 'compressed'
  }, function (error, result) {
    if (!error) {
      writeJS(replaceCSS(js, result.css));
    } else {
      console.log("Sass compilation error");
      console.log(error);
    }
  });
};

let replaceCSS = function (source, css) {
  return source.replace("{{CSS}}", css.toString('utf8').replace(/\"/g, '\\"').trim());
};

let writeJS = function (js) {
  fs.writeFile('src/codeblock.component.js', js, function (err) {
    if (!err) {
      console.log("CSS injected");
    } else {
      console.log("Could not write css to js file");
      console.log(err);
    }
  });
};

fs.readFile('src/codeblock.component.js', 'utf8', function (err, js) {
  buildSass(js);
});
