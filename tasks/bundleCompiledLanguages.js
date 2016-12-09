let fs = require('fs');
let rimraf = require('rimraf');

console.log("Bundling language directives...");

rimraf.sync('bundles/languages');
fs.mkdirSync('bundles/languages');

let languages = fs.readdirSync('languages')
  .map(function (file) {
    let match = file.match(/(\w+)\.js$/);
    return match ? match[1] : null;
  })
  .filter(function (name) {
    return name != undefined;
  });

languages.forEach(function (language) {
  let requires = fs.readFileSync('languages/' + language + ".js");
  let file = "src/languages/" + language + ".js";
  let directive = fs.readFileSync(file);
  let out = "bundles/languages/" + language + ".js";
  fs.writeFileSync(out, requires + "\n\n" + directive);
});

rimraf.sync('languages');

console.log("Languages Bundled");
