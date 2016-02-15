import {Component, Input} from 'angular2/core';

@Component({
  selector: 'example',
  template: `
    <section class="content">
      <div class="blocks">
        <div class="col">
          <h1>Template</h1>
          <ng-content select="[code]"></ng-content>
        </div>
        <div class="col">
          <h1 class="result">Result</h1>
          <ng-content select="[highlighted]"></ng-content>
        </div>
      </div>
    </section>
  `,
  styleUrls: [`app/example/example.component.css`],
  directives: []
})
export class ExampleComponent { }
