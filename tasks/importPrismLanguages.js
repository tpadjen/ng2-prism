// Import all languages from prismjs into local languages folder for easy imports
//    - rerun when prism languages change
var fs = require('fs');
var rimraf = require('rimraf');

function buildImport(lang) {
  return "require('ng2-prism/src/languages/" + lang + "');\n\n";
}

console.log("Cleaning languages folder");
rimraf.sync('languages');
fs.mkdirSync('languages');

// var requireImports = {
//   bison: 'c',
//   cpp: 'c',
//   crystal: 'ruby',
//   objectivec: 'c',
//   scala: 'java',
// };

var excludes = {
  core: true
};

var languages = fs.readdirSync('node_modules/prismjs/components')
                  .map(function(file) {
                    var match = file.match(/prism-(\w+)\.js$/);
                    return match ? match[1] : null;
                  })
                  .filter(function(name) {
                    return name != undefined;
                  });

process.stdout.write("Importing languages");
languages.forEach(function(lang) {
  if (excludes[lang]) return;

  process.stdout.write(".");
  var file = "languages/" + lang + ".js";
  var original = 'node_modules/prismjs/components/prism-' + lang + '.js';
  var text = fs.readFileSync(original);
  // if (requireImports[lang]) { text = buildImport(requireImports[lang]) + text; }
  fs.writeFileSync(file, text);
});
console.log("\ndone");
