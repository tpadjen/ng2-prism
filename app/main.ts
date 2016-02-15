import 'reflect-metadata';

import {bootstrap} from 'angular2/bootstrap';
import {HTTP_PROVIDERS} from 'angular2/http';

import {AppComponent} from './app.component';

bootstrap(AppComponent, [
  HTTP_PROVIDERS
]);
