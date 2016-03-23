var fs = require('fs');
var rimraf = require('rimraf');

console.log("Bundling language directives...");

rimraf.sync('bundles/languages');
fs.mkdirSync('bundles/languages');

var languages = fs.readdirSync('languages')
                  .map(function(file) {
                    var match = file.match(/(\w+)\.js$/);
                    return match ? match[1] : null;
                  })
                  .filter(function(name) {
                    return name != undefined;
                  });

languages.forEach(function(language) {
  var requires = fs.readFileSync('languages/' + language + ".js");
  var file = "src/languages/" + language + ".js";
  var directive = fs.readFileSync(file);
  var out = "bundles/languages/" + language + ".js";
  fs.writeFileSync(out, requires + "\n\n" + directive);
});

rimraf.sync('languages');

console.log("Languages Bundled");
