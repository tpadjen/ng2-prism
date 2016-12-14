const fs = require('fs');
const rimraf = require('rimraf');

const baseDir = './src/languages';

const _buildImport = (lang) => `import 'prismjs/components/prism-${lang}';\n`;
const _title = (_language) => (_language.charAt(0).toUpperCase() + _language.slice(1) + 'Directive');
const _filename = (_language) => `${baseDir}/${_language}.ts`;

const requireImports = {
  bison: 'c',
  cpp: 'c',
  crystal: 'ruby',
  objectivec: 'c',
  scala: 'java'
};

const excludes = {core: true};

const languages = fs
  .readdirSync('node_modules/prismjs/components')
  .map(function (file) {
    const match = file.match(/prism-(\w+)\.js$/);
    return match ? match[1] : null;
  })
  .filter((name) => (name != null))
  .filter(lang => !excludes[lang]);

const languageTemplate = fs
  .readFileSync('./tasks/class-templates/language-template.ts', 'utf8');

rimraf.sync(baseDir);
fs.mkdirSync(baseDir);

const tsExports = languages
  .map(function (language) {
    const title = _title(language);
    const filename = _filename(language);

    let data = languageTemplate
      .replace(/__lang__/g, language)
      .replace(/__lang_title__/g, title);

    if (requireImports[language]) {
      data = _buildImport(requireImports[language]) + data;
    }

    fs.writeFileSync(filename, data);

    return `import {${title}} from './${language}';
export {${title}} from './${language}';`;
  });

const langDirectives = languages
  .map(_title);

const index = `${tsExports.join("\n")} \n export const DIRECTIVES = [${langDirectives.join(',')}]`;

fs.writeFileSync(`${baseDir}/index.ts`, index);

console.log("Language directives built");
