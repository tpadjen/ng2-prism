import {Component} from 'angular2/core';

import {ExampleComponent} from './example/example.component';

import {CodeblockComponent} from 'ng2-prism/codeblock';

import 'ng2-prism/languages/prism-ruby';
import 'ng2-prism/languages/prism-java';

@Component({
  selector: 'ng2-prism-app',
  templateUrl: 'app/app.component.html',
  directives: [ExampleComponent, CodeblockComponent]
})
export class AppComponent {}
