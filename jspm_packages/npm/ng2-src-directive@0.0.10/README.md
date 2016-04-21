# ng2-src-directive

An Angular2 directive for fetching the source of an element from a remote.

## Source Directive

The `Source` directive fetches the url provided and sets the `innerHtml` of the element to which it is attached to the text of the response.

### Usage

In your component that will use src import the `Source` directive. Include `Source` in the component's `directives` array. Add the src attribute to an element inside your template.

```ts
import {Source} from 'ng2-src-directive/src';

@Component({
  selector: 'my-component'
  directives: [Source],
  template: [`
    <p src="my/remote/source.html"></p>
    <div [src]="mySource"></div>
  `]
})
export class MyComponent {
  mySource: string = 'some/other/source.txt';
  ...
}
```

## Lifecycle Events

Lifecycle hooks are provided to allow your component to respond to source events with more granularity. The available hooks are:

* `sourceChanged(url: string)`: The value of the src attribute has changed, kicking off validation and fetching of the remote resource.
* `sourceLoading(url: string)`: The src attribute has been validated (not null) and the resource is being fetched
* `sourceError(string)`: An error occured while fetching the file, such as `file not found`.
* `sourceReceived(Response)`: The source was fetched successfully. the `Response` is the result from the angular2 `Http` get. If a `sourceReceived` implementation is provided on your component the source directive will no longer automatically set the innerHtml of the element to the reponse text. It is your responsibility and prerogative to handle the response.

The hooks each have a recommended corresponding interface that can be implemented by the component class for type checking. They are:

* `OnSourceChanged`
* `OnSourceLoading`
* `OnSourceError`
* `OnSourceReceived`

### Usage

In your component that will use src import the `Source` directive, optionally one or more source interfaces, and the `Response` you will receive. Include `Source` in the component's `directives` array. Have your component `implement` the interface(s) if you want type checking.

```ts
import {Component} from 'angular2/core';
import {
  Source,
  OnSourceChanged,
  OnSourceLoading,
  OnSourceError,
  OnSourceReceived,
  Response
} from 'ng2-src-directive/src';

@Component({
  selector: 'my-component'
  directives: [Source],
  ...
})
export class MyComponent implements OnSourceChanged,
                                    OnSourceLoading,
                                    OnSourceError,
                                    OnSourceReceived {
  
}
```

Add the src attribute inside your template.

```ts
...
template: [`
  <p src="my/remote/source.html"></p>
`]

```

Implement any method on your component.

```ts
export class MyComponent implements OnSourceChanged,
                                    OnSourceLoading,
                                    OnSourceError,
                                    OnSourceReceived {
  
  constructor(private _el: ElementRef) { }

  sourceChanged(url: string) {
    console.log('Source changed to ' + url);
  }

  sourceChanged(url: string) {
    console.log('Source loading from ' + url);
  }

  sourceError(error: string) {
    console.error(error);
  }

  sourceReceived(res: Response) {
    this._el.nativeElement.innerHtml = res.text();
  }

}
```

## Debounce Time

The `Source` directive automatically throttles http requests it sends out on `src` changes to prevent overwhelming the server. The default waiting time is 200 ms. There are two ways to change this.

1. Set the `debounceTime` attribute to a number of milliseconds on an element:
```html
<p src="remote/source.html" debounceTime="100"></p>
```
2. Provide `SourceDebounceTime` with a number of milliseconds:
```ts
import {Component, provide} from 'angular2/core'
import {Source, SourceDebounceTime} from 'ng2-src-directive/src';

@Component({
  ...
  providers: [
    provide(SourceDebounceTime, {useValue: 100})
  ]
})
```
`SourceDebounceTime` can be provided at any level of the app.
