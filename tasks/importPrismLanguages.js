// Import all languages from prismjs into local languages folder for easy imports
//    - rerun when prism languages change
let fs = require('fs');
let rimraf = require('rimraf');

function buildImport(lang) {
  return "require('ng2-prism/src/languages/" + lang + "');\n\n";
}

console.log("Cleaning languages folder");
rimraf.sync('languages');
fs.mkdirSync('languages');

let excludes = {
  core: true
};

let languages = fs.readdirSync('node_modules/prismjs/components')
  .map(function (file) {
    let match = file.match(/prism-(\w+)\.js$/);
    return match ? match[1] : null;
  })
  .filter(function (name) {
    return name != undefined;
  });

process.stdout.write("Importing languages");
languages.forEach(function (lang) {
  if (excludes[lang]) return;

  process.stdout.write(".");
  let file = "languages/" + lang + ".js";
  let original = 'node_modules/prismjs/components/prism-' + lang + '.js';
  let text = fs.readFileSync(original);
  fs.writeFileSync(file, text);
});
console.log("\ndone");
