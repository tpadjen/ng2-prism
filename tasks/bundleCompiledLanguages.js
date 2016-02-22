var fs = require('fs');
var rimraf = require('rimraf');

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
  var file = "bundle/languages/" + language + ".js";
  var directive = fs.readFileSync(file);
  fs.writeFileSync(file, requires + "\n\n" + directive);
});

rimraf.sync('languages');