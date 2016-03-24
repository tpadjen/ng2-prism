import 'es6-shim/es6-shim';
import 'jspm_packages/system-polyfills';
import 'angular2/bundles/angular2-polyfills';
import 'reflect-metadata';


import {bootstrap} from 'angular2/bootstrap';
import {HTTP_PROVIDERS} from 'angular2/http';

import {AppComponent} from './app.component';

bootstrap(AppComponent, [
  HTTP_PROVIDERS
]);
