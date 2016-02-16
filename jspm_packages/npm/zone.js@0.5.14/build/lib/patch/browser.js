/* */ 
var fnPatch = require('./functions');
var promisePatch = require('./promise');
var mutationObserverPatch = require('./mutation-observer');
var definePropertyPatch = require('./define-property');
var registerElementPatch = require('./register-element');
var eventTargetPatch = require('./event-target');
var propertyDescriptorPatch = require('./property-descriptor');
var geolocationPatch = require('./geolocation');
var fileReaderPatch = require('./file-reader');
function apply() {
  fnPatch.patchSetClearFunction(global, global.Zone, [['setTimeout', 'clearTimeout', false, false], ['setInterval', 'clearInterval', true, false], ['setImmediate', 'clearImmediate', false, false], ['requestAnimationFrame', 'cancelAnimationFrame', false, true], ['mozRequestAnimationFrame', 'mozCancelAnimationFrame', false, true], ['webkitRequestAnimationFrame', 'webkitCancelAnimationFrame', false, true]]);
  fnPatch.patchFunction(global, ['alert', 'prompt']);
  eventTargetPatch.apply();
  propertyDescriptorPatch.apply();
  promisePatch.apply();
  mutationObserverPatch.patchClass('MutationObserver');
  mutationObserverPatch.patchClass('WebKitMutationObserver');
  definePropertyPatch.apply();
  registerElementPatch.apply();
  geolocationPatch.apply();
  fileReaderPatch.apply();
}
exports.apply = apply;
