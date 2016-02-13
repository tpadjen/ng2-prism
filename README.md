# ng2-prism

An Angular2 codeblock highlighting component using Prismjs.

## Installation

ng2-prism requires **angular2 beta3**, **rxjs**, and the gh-pages branch of **prismjs** installed separately.

### jspm

```
$ jspm i angular2 rxjs prism@gh-pages npm:ng2-prism
```

### npm

```
$ npm i angular2 rxjs git://github.com/PrismJS/prism.git#gh-pages ng2-prism --save
```

## Setup

### jspm and systemjs

The npm and jspm prism packages have two different names, so you must add a line to your SystemJS config under the `map` section:

```json
map: {
  // ...
  "prismjs": "github:PrismJS/prism@gh-pages",
  // ...
}
```

Load this config before importing your app bundle.

### systemjs only (installed with npm)

Systemjs needs to know the path to the imported dependencies. Use `map`, and make sure `defaultJSExtensions` is set to `true`. Here is an example config, for use with the angular2 quickstart:

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
import {CodeblockComponent} from './path/to/component';
```

Import the Prismjs language definition for your codeblock:
```ts
import 'prism/components/prism-ruby';
```

Include the component in the directives array:
```ts
@Component({
  selector: 'my-component',
  // ...
  directives: [CodeblockComponent]
})
```

Add a codeblock to the template and specify its language:

```html
<codeblock language="ruby">
  def my_new_method
    p "So Impressive!"
  end
</codeblock>
```


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