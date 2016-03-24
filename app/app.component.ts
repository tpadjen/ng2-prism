import {Component} from 'angular2/core';

import {ExampleComponent} from './example/example.component';

import {LinklistService} from './linklist/linklist.service';
import {LinklistComponent} from './linklist/linklist.component';
import {LinkDirective} from './linklist/link.directive';

import {Codeblock} from 'ng2-prism/codeblock';

import {Ruby} from       'ng2-prism/languages/ruby';
import {Java} from       'ng2-prism/languages/java';
import {Go} from         'ng2-prism/languages/go';
import {Python} from     'ng2-prism/languages/python';
import {Javascript} from 'ng2-prism/languages/javascript';
import {Typescript} from 'ng2-prism/languages/typescript';
import {Markup} from     'ng2-prism/languages/markup';


@Component({
  selector: 'ng2-prism-app',
  templateUrl: 'app/app.component.html',
  styleUrls: [ `app/app.component.css`],
  directives: [
    ExampleComponent,
    Codeblock,
    Ruby,
    Java,
    Go,
    Python,
    Javascript,
    Typescript,
    Markup,
    LinklistComponent,
    LinkDirective
  ],
  providers: [LinklistService]
})
export class AppComponent {

  themes = Codeblock.THEMES;
  selectedTheme: string = "standard";
  binding = 'Alice';
  bindingExpression = "{{cb.bind('expression')}}";
  highlighted = true;

  ngOnInit() {
    // replace hash because it might load too late
    if (window.location.hash) {
      history.replaceState("", document.title, window.location.pathname + window.location.search);
      window.scrollTo(0, 0);
    }
  }

}
