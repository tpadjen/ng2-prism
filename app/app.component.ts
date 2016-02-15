import {Component} from 'angular2/core';

import {ExampleComponent} from './example/example.component';

import {CodeblockComponent} from 'ng2-prism/codeblock';

import 'ng2-prism/languages/prism-ruby';

@Component({
  selector: 'ng2-prism-app',
  template: `
      <example title="Basic">
        <p pre>Hi there.</p>
        <div code>
          <codeblock language="markup" theme="okaidia">
            &lt;codeblock language="javascript">
              console.log("Hello');
            &lt;/codeblock>
          </codeblock>
        </div>
        <div highlighted>
          <codeblock language="javascript">
            console.log("Hello');
          </codeblock>
        </div>
        <p post>Goodbye</p>
      </example>
  `,
  directives: [ExampleComponent, CodeblockComponent]
})
export class AppComponent {}
