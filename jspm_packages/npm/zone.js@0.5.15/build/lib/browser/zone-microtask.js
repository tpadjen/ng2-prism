/* */ 
'use strict';
var microtask = require('../microtask');
var es6Promise = require('es6-promise');
var core = require('../core');
var browserPatch = require('../patch/browser');
if (core.Zone.prototype['scheduleMicrotask']) {
  console.warn('Zone-microtasks already exported on window the object!');
} else {
  microtask.addMicrotaskSupport(core.Zone);
  global.Zone = core.Zone;
  global.zone = new global.Zone();
  global.Promise = es6Promise.Promise;
  browserPatch.apply();
}
