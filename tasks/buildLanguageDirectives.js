var fs = require('fs');
var rimraf = require('rimraf');

// Build language directives from template
// and insert exports into
//  * tsconfig

rimraf.sync('src/languages');
fs.mkdirSync('src/languages');


var languages = fs.readdirSync('languages')
                  .map(function(file) {
                    var match = file.match(/(\w+)\.js$/);
                    return match ? match[1] : null;
                  })
                  .filter(function(name) {
                    return name != undefined;
                  });

var languageTemplate = fs.readFileSync('src/language-template.ts', 'utf8');
var  jsExports = [];
var dtsExports = [];
var tsFiles = ["src/codeblock.component.ts"];

languages.forEach(function(language) {
  var data = languageTemplate.replace(/{{lang}}/g, language);
  var title = language.charAt(0).toUpperCase() + language.slice(1);
  data = data.replace(/{{lang_title}}/g, title);
  var filename = "src/languages/" + language + ".ts";
  tsFiles.push(filename);
  fs.writeFileSync(filename, data);
  jsExports.push("exports." + title + " = require('./languages/" + 
                  language + "')." +  title + ';');
  dtsExports.push("export * from './languages/" + language + "';");
});

tsFiles = tsFiles.map(function(file) { return '"' + file + '"'; });

var tsconfig = fs.readFileSync('tsconfig.json', 'utf8');
var ts = tsconfig.replace(/([\s\S]*)(files": \[\n)([\s\S]+)(\][\s\S]*)/, 
                          "$1$2    " + tsFiles.join(",\n    ") + "\n" + "  $4");
fs.writeFileSync('tsconfig.json', ts);

var inject = function(filename, list) {
  var contents = fs.readFileSync(filename, 'utf8');
  var injected = contents.replace(
      /([\s\S]*)(\/\* Injected by script \*\/\n)([\s\S]+)(\/\* end \*\/)([\s\S]*)/, 
                            "$1$2" + list.join("\n") + "\n" + "$4$5");
  fs.writeFileSync(filename, injected);  
}

inject('languages.js', jsExports);
inject('languages.d.ts', dtsExports);

console.log("Language directives built");