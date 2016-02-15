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

Systemjs needs to know the path to `ng2-prism`, along with the typical angular dependencies (including http). Use `map`, and make sure `defaultJSExtensions` is set to `true`. Here is an example config, for use with the angular2 quickstart:

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
      "ng2-prism": "node_modules/ng2-prism"
    }
  });
  System.import('app/main')
        .then(null, console.error.bind(console));
</script>
```


## Usage

Import the component:

```ts
import {CodeblockComponent} from './path/to/component';
```

Import the Prismjs language definition for your codeblock:
```ts
import 'ng2-prism/languages/prism-ruby';
```

Include the component in the directives array:
```ts
@Component({
  selector: 'my-component',
  // ...
  directives: [CodeblockComponent]
})
```

Add a `codeblock` to the template and specify its language:

```html
<codeblock language="ruby">
  def my_new_method
    p "So Impressive!"
  end
</codeblock>
```

### Dynamic Loading

Use the `src` attribute to set a file to download as the source code for a `codeblock`. The language of the `codeblock` will be determined from the file extension, unless a language is specified.

```html
<!-- automatically loads as javascript -->
<codeblock src="path/to/main.js"></codeblock>

<!-- tries to highlight the downloaded file as typescript --> 
<codeblock language="typescript" src="path/to/main.js"></codeblock>
```

Noted on Dynamic loading:
  
  * The `codeblock` will automatically update on changes to `src`. These updates are not throttled by the codeblock.
  * The `src` attribute must have a file extension.
  * Everything inside the dynamic codeblock will be erased.

### Themes

Add a class with the theme name to the `codeblock` element:

```html
<codeblock language="javascript" class="dark">
  // dark themed
</codeblock>

``` 

Your theme options are:

  * prism default (no class)
  * coy
  * dark
  * funky
  * okaidia
  * solarizedlight
  * tomorrow
  * twilight

To change the theme dynamically (`selectedTheme` is a variable):
```html
<codeblock [class]="selectedTheme"></codeblock>
                    or
<codeblock class="{{selectedTheme}}"></codeblock>
```

### HTML

To embed `HTML` use the language **markup**.

If you use standard `HTML` tags, and carefully close each one, you can write it as normal inside a `codeblock`:

```html
<codeblock language="markup">
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
<codeblock language="markup">
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

Any `Angular2 Components` that manipulate the DOM, such as a `codeblock` or an `ngIf`, should also be escaped:

```html
<codeblock language="markup">
  &lt;codeblock language="markup">
    &lt;section *ngIf="true" >A&lt;/section>
    &lt;section *ngIf="false">B&lt;/section>
  &lt;/codeblock>
</codeblock>
```

### Line Numbers

Ng2-prism automatically adds line numbers to codeblocks. To disable them bind a `lineNumbers` attribute to `false`:
```html
<codeblock [lineNumbers]="false"></codeblock>
                    or
<codeblock lineNumbers="{{someBoolean}}"></codeblock>