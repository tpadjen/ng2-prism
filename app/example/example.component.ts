import {Component, Input} from 'angular2/core';

@Component({
  selector: 'example',
  template: `
      <h1 class="title">{{title}}</h1>
      <section class="content">
        <div class="pre">
          <ng-content select="[pre]"></ng-content>
        </div>
        <div class="blocks">
          <div class="col">
            <h1>Template</h1>
            <ng-content select="[code]"></ng-content>
          </div>
          <div class="col">
            <h1>Result</h1>
            <ng-content select="[highlighted]"></ng-content>
          </div>
        </div>
        <div class="post">
          <ng-content select="[post]"></ng-content>
        </div>
      </section>
  `,
  styleUrls: [`app/example/example.component.css`],
  directives: []
})
export class ExampleComponent {

  @Input() title;

}
