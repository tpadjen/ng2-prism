var fs = require('fs');
var rimraf = require('rimraf');

// Build language directives from template
// and insert exports into
//  * tsconfig
//  * languages.js
//  * languages.d.ts

rimraf.sync('src/languages');
fs.mkdirSync('src/languages');


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

var languageTemplate = fs.readFileSync('src/language-template.ts', 'utf8');
var  jsExports = [];
var dtsExports = [];
var tsFiles = [
  "typings/browser.d.ts",
  "codeblock.ts",
  "src/codeblock.component.ts",
  "src/code-renderer.component.ts",
  "src/src.service.ts"
];

languages.forEach(function(language) {
  if (excludes[language]) return;

  var data = languageTemplate.replace(/{{lang}}/g, language);
  var title = language.charAt(0).toUpperCase() + language.slice(1);
  data = data.replace(/{{lang_title}}/g, title);
  var filename = "src/languages/" + language + ".ts";
  tsFiles.push(filename);
  fs.writeFileSync(filename, data);
  jsExports.push("exports." + title + " = require('./src/languages/" +
                  language + "')." +  title + ';');
  dtsExports.push("export * from './src/languages/" + language + "';");
});

tsFiles = tsFiles.map(function(file) { return '"' + file + '"'; });

var tsconfig = fs.readFileSync('tsconfig.json', 'utf8');
var ts = tsconfig.replace(/([\s\S]*)(files": \[\n)([\s\S]+)(\][\s\S]*)/,
                          "$1$2    " + tsFiles.join(",\n    ") + "\n" + "  $4");
fs.writeFileSync('tsconfig.json', ts);

var inject = function(filename, list) {
  fs.writeFileSync(filename, list.join("\n"));
}

inject('languages.js', jsExports);
inject('languages.d.ts', dtsExports);

console.log("Language directives built");
