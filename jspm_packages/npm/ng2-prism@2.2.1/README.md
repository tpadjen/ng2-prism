# ng2-prism

An Angular2 codeblock highlighting component using Prismjs.

## Installation

### jspm

```
$ jspm i npm:ng2-prism
```

### npm

```
$ npm i ng2-prism --save
```

## Setup

### jspm and systemjs

No additional setup necessary.

### systemjs only (installed with npm)

Systemjs needs to know the path to `ng2-prism` and `prismjs`, along with the typical angular dependencies (including http). Use `map`, and make sure `defaultJSExtensions` is set to `true`. Here is an example config, for use with the angular2 quickstart:

```html
<script>
  System.config({
    defaultJSExtensions: true,
    packages: {        
      app: {
        format: 'register'
      }
    },
    map: {
      "angular2": "node_modules/angular2",
      "rxjs": "node_modules/rxjs",
      "ng2-prism": "node_modules/ng2-prism",
      "prismjs": "node_modules/prismjs"
    }
  });
  System.import('app/main')
        .then(null, console.error.bind(console));
</script>
```


## Usage

Import the component:

```ts
import {Codeblock} from 'ng2-prism/codeblock';
```

Import the language definition for your codeblock:
```ts
import {Ruby} from 'ng2-prism/languages';
```

Include the component and language directive in the directives array:
```ts
@Component({
  selector: 'my-component',
  // ...
  directives: [Codeblock, Ruby]
})
```

Add a `codeblock` to the template with the language directive attached:

```html
<codeblock ruby>
  def my_new_method
    p "So Impressive!"
  end
</codeblock>
```
### Angular2 Bindings

Use angular bindings like normal for variable output.

```html
<input type="text" [(ngModel)]="name">

// {{name}} will be replaced by whatever is typed in the input
<codeblock javascript>
  if (name === '{{name}}') {
    console.log("Hello, " + name);
  }
</codeblock>
```

If you want to display the binding without processing place a `pre` tag around any of the braces.

```html
<input type="text" [(ngModel)]="name">

// {{name}} will not be replaced
<codeblock javascript>
  <pre>{</pre>{name}}
</codeblock>
```

### Dynamic Loading

Use the `src` attribute to set a file to download as the source code for a `codeblock`. The language of the `codeblock` will be determined from the file extension, unless a language is specified.

```html
<!-- automatically loads as javascript -->
<codeblock src="path/to/main.js"></codeblock>

<!-- tries to highlight the downloaded file as typescript -->
<codeblock typescript src="path/to/main.js"></codeblock>
```

Noted on Dynamic loading:

  * The `codeblock` will automatically update on changes to `src`.
  * Updates to src are throttled at 300ms to prevent unnecessary http requests, you can change the time by setting `debounceTime` on the codeblock.
  * The `src` attribute must have a file extension.
  * Everything inside the dynamic codeblock will be replaced by the contents of the source file.
  * The source contents are treated as text only, not DOM elements. Components, directives, and bindings will not be processed by angular2.

### Themes

Add a `theme` attribute to the `codeblock` element:

```html
<codeblock javascript theme="dark">
  // dark themed
</codeblock>

<codeblock javascript [theme]="selectedTheme">
  // uses whichever theme is currently stored in the selectedTheme variable
</codeblock>

```

Your theme options are:

  * standard
  * coy
  * dark
  * funky
  * okaidia
  * solarizedlight
  * tomorrow
  * twilight

The list of themes is available at runtime with `CodeblockComponent.THEMES`.

### HTML

To embed `HTML` use the language **markup**.

If you use standard `HTML` tags, and carefully close each one, you can write it as normal inside a `codeblock`:

```html
<codeblock markup>
  <ul class="favorites">
    <li>These are</li>
    <li>a few of</li>
    <li>my favorite</li>
    <li>things.</li>
  </ul>
</codeblock>

If you want to write a fragment of `HTML` with some unmatched tags the angular interpreter is going to fail to load your template. You must change any opening or closing tag angle brackets, <, to the html entity version:

`< => &lt;`

```html
<codeblock markup>
  &lt;html>
    &lt;head>
    &lt;title>Angular 2 QuickStart&lt;/title>
    &lt;meta name="viewport" content="width=device-width, initial-scale=1">

    &lt;!-- 1. Load libraries -->
    &lt;!-- IE required polyfills, in this exact order -->
    &lt;script src="node_modules/es6-shim/es6-shim.min.js">&lt;/script>
    &lt;script src="node_modules/systemjs/dist/system-polyfills.js">&lt;/script>
    ...
</codeblock>

```

Dynamically loaded files do not have this limitation.

`Angular2 Components`, such as a `codeblock` or an `ngIf`, will be processed by angular before highlighting. If you want to show their preprocessed version in the highlighted section instead of their results they should be escaped:

```html
<!-- Will display 'A' only -->
<codeblock markup>
  <section *ngIf="true" >A</section>
  <section *ngIf="false">B</section>
</codeblock>

<!-- Will display both section elements -->
<codeblock markup>
  &lt;section *ngIf="true" >A&lt;/section>
  &lt;section *ngIf="false">B&lt;/section>
</codeblock>
```

If you want to show bindings without processing use the `bind` method on a local variable assigned to the `codeblock`:

```html
<codeblock markup #cb>
  {{ cb.bind('expression') }}
</codeblock>

// result
{{expression}}
```

### Language

You may optionally specify a `language` attribute instead of using a directive:

```html
<codeblock language="ruby">
  def my_new_method
    p "So Impressive!"
  end
</codeblock>
```

The attribute makes the language easy to change dynamically:

```
<codeblock [language]="modern ? 'typescript' : 'javascript'">
  import {Component} from 'angular2/core';
</codeblock>
```

Codeblocks without a valid loaded `language` attribute or directive get everything except syntax highlighting:

```html
<codeblock>
  Just normal text
  but themed
  with line numbers
</codeblock>

<codeblock language="spanish">
  Eso no es un lenguaje de verdad!
</codeblock>
```

If you choose to use the `language` attribute the language must still be imported, but you do not have to list it in the directives array because the template does not need to know about it.

*All languages are automatically loaded when **any** language is imported from ng2-prism/languages*. To import only the language(s) you want:
```js
// if you want the directive:
import {Ruby} from 'ng2-prism/languages/ruby';

// If you just want the language:
import 'ng2-prism/languages/ruby';
```

### Line Numbers

Ng2-prism automatically adds line numbers to codeblocks. To disable them bind a `lineNumbers` attribute to `false`:
```html
<codeblock [lineNumbers]="false"></codeblock>
                    or
<codeblock [lineNumbers]="someBooleanExpression"></codeblock>
```

### Shell

Use the `shell` attribute to display a shell prompt. Pass in the type of shell, either `bash` or `powershell`.

```html
<codeblock shell="bash">
  ls
</codeblock>

<codeblock shell="powershell">
  dir
</codeblock>
```

The `language` attribute is ignored on `shell` `codeblocks`.

The default `theme` for shells is `okaidia`.

#### Prompt

Change the `prompt` to whatever you want:

```html
<codeblock shell="bash" prompt="#">cd ..</codeblock>
# cd ..

<codeblock shell="bash" prompt="[user@host] $">cd ..</codeblock>
[user@host] $ cd ..
```

#### Output

Shells can have certain lines treated as console output, so they don't have a prompt. Use the `outputLines` attribute. It accepts a comma-separated list of lines or line ranges:

```html
<codeblock shell="bash" outputLines="2,4,5,7-10">
  cd ../..
  This is output
  mkdir hello
  so is
  this
  rm -rf hello
  more output
  more output
  more output
  more output
</codeblock>

$ cd ../..
  This is output
$ mkdir hello
  so is
  this
$ rm -rf hello
  more output
  more output
  more output
  more output
```
