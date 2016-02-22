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
  var file = 'languages/' + language + ".js";
  var requires = fs.readFileSync(file);
  var directive = fs.readFileSync('bundle/languages/' + language + ".js");
  fs.writeFileSync(file, requires + "\n\n" + directive);
  var dts = language + ".d.ts"
  fs.createReadStream('bundle/languages/' + dts)
    .pipe(fs.createWriteStream('languages/' + dts));
});

rimraf.sync('bundle/languages');