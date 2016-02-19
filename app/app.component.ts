import {Component} from 'angular2/core';

import {ExampleComponent} from './example/example.component';

import {CodeblockComponent} from 'ng2-prism/codeblock';

import 'ng2-prism/languages/prism-ruby';
import 'ng2-prism/languages/prism-java';
import 'ng2-prism/languages/prism-go';
import 'ng2-prism/languages/prism-python';
import 'ng2-prism/languages/prism-typescript';
import 'ng2-prism/languages/prism-markup';
import 'ng2-prism/languages/prism-bash';
import 'ng2-prism/languages/prism-powershell';

@Component({
  selector: 'ng2-prism-app',
  templateUrl: 'app/app.component.html',
  styleUrls: [ `app/app.component.css`],
  directives: [ExampleComponent, CodeblockComponent]
})
export class AppComponent {

  themes = CodeblockComponent.THEMES;
  selectedTheme: string = "standard";

}
