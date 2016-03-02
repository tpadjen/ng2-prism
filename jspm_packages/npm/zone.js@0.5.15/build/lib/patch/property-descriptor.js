/* */ 
var webSocketPatch = require('./websocket');
var utils = require('../utils');
var keys = require('../keys');
var eventNames = 'copy cut paste abort blur focus canplay canplaythrough change click contextmenu dblclick drag dragend dragenter dragleave dragover dragstart drop durationchange emptied ended input invalid keydown keypress keyup load loadeddata loadedmetadata loadstart message mousedown mouseenter mouseleave mousemove mouseout mouseover mouseup pause play playing progress ratechange reset scroll seeked seeking select show stalled submit suspend timeupdate volumechange waiting mozfullscreenchange mozfullscreenerror mozpointerlockchange mozpointerlockerror error webglcontextrestored webglcontextlost webglcontextcreationerror'.split(' ');
function apply() {
  if (utils.isNode()) {
    return;
  }
  var supportsWebSocket = typeof WebSocket !== 'undefined';
  if (canPatchViaPropertyDescriptor()) {
    if (!utils.isWebWorker()) {
      var onEventNames = eventNames.map(function(property) {
        return 'on' + property;
      });
      utils.patchProperties(HTMLElement.prototype, onEventNames);
    }
    utils.patchProperties(XMLHttpRequest.prototype);
    if (supportsWebSocket) {
      utils.patchProperties(WebSocket.prototype);
    }
  } else {
    if (!utils.isWebWorker()) {
      patchViaCapturingAllTheEvents();
    }
    utils.patchClass('XMLHttpRequest');
    if (supportsWebSocket) {
      webSocketPatch.apply();
    }
  }
}
exports.apply = apply;
function canPatchViaPropertyDescriptor() {
  if (!utils.isWebWorker() && !Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'onclick') && typeof Element !== 'undefined') {
    var desc = Object.getOwnPropertyDescriptor(Element.prototype, 'onclick');
    if (desc && !desc.configurable)
      return false;
  }
  Object.defineProperty(XMLHttpRequest.prototype, 'onreadystatechange', {get: function() {
      return true;
    }});
  var req = new XMLHttpRequest();
  var result = !!req.onreadystatechange;
  Object.defineProperty(XMLHttpRequest.prototype, 'onreadystatechange', {});
  return result;
}
;
var unboundKey = keys.create('unbound');
function patchViaCapturingAllTheEvents() {
  eventNames.forEach(function(property) {
    var onproperty = 'on' + property;
    document.addEventListener(property, function(event) {
      var elt = event.target,
          bound;
      while (elt) {
        if (elt[onproperty] && !elt[onproperty][unboundKey]) {
          bound = global.zone.bind(elt[onproperty]);
          bound[unboundKey] = elt[onproperty];
          elt[onproperty] = bound;
        }
        elt = elt.parentElement;
      }
    }, true);
  });
}
;
