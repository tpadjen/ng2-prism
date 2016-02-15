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

Use the `src` attribute to set a file to download as the source code for the `codeblock`. The language of the `codeblock` will be determined from the file extension.

```html
<codeblock src="path/to/main.js"></codeblock>
```

The `codeblock` will automatically update on changes to `src`.

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

### HTML

To embed `HTML` use the language **markup** and change any opening tag angle brackets, <, to the html entity version:

`< => &lt;`

```html
<codeblock language="markup">
  &lt;codeblock language="javascript">
    var x = function() {
      console.log("b");
    }
  &lt;/codeblock>
</codeblock>
```