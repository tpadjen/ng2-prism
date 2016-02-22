// Import all languages from prismjs into local languages folder for easy imports
//    - rerun when prism languages change
var fs = require('fs');
var rimraf = require('rimraf');

function buildImport(lang) {
  return "require('ng2-prism/node_modules/prismjs/components/prism-" + lang + "');\n";
}

console.log("Cleaning languages folder");
rimraf.sync('languages');
fs.mkdirSync('languages');

var requireImports = {
  bison: 'c',
  cpp: 'c',
  objectivec: 'c',
  scala: 'java',
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
  process.stdout.write(".");
  var file = "languages/prism-" + lang + ".js";
  var text = buildImport(lang)
  if (requireImports[lang]) { text = buildImport(requireImports[lang]) + text; }
  fs.writeFileSync(file, text);
});
console.log("\ndone");
