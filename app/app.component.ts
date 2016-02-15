import {Component} from 'angular2/core';

import {ExampleComponent} from './example/example.component';

import {CodeblockComponent} from 'ng2-prism/codeblock';

import 'ng2-prism/languages/prism-ruby';
import 'ng2-prism/languages/prism-java';
import 'ng2-prism/languages/prism-go';
import 'ng2-prism/languages/prism-python';

@Component({
  selector: 'ng2-prism-app',
  templateUrl: 'app/app.component.html',
  styles: [`
    p {padding-left: 14px;}
  `],
  directives: [ExampleComponent, CodeblockComponent]
})
export class AppComponent {}
