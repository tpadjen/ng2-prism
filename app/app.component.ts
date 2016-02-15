import {Component} from 'angular2/core';

import {CodeblockComponent} from 'ng2-prism/codeblock';

import 'ng2-prism/languages/prism-ruby';

@Component({
  selector: 'ng2-prism-app',
  template: `
      <codeblock language="javascript" theme="okaidia">console.log("Hello');</codeblock>

      <codeblock language="ruby" theme="okaidia">
        a = [1, 2, 3]
        puts a
        if a[1] == 3
          puts "Hello"
        end
      </codeblock>

      <codeblock src="config.js" [lineNumbers]="false"></codeblock>
  `,
  directives: [CodeblockComponent]
})
export class AppComponent {}
