/* */ 
'use strict';
var serializer_1 = require('../shared/serializer');
var event_serializer_1 = require('./event_serializer');
var exceptions_1 = require('../../facade/exceptions');
var async_1 = require('../../facade/async');
var EventDispatcher = (function() {
  function EventDispatcher(_sink, _serializer) {
    this._sink = _sink;
    this._serializer = _serializer;
  }
  EventDispatcher.prototype.dispatchRenderEvent = function(element, eventTarget, eventName, event) {
    var serializedEvent;
    switch (event.type) {
      case "click":
      case "mouseup":
      case "mousedown":
      case "dblclick":
      case "contextmenu":
      case "mouseenter":
      case "mouseleave":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "show":
        serializedEvent = event_serializer_1.serializeMouseEvent(event);
        break;
      case "keydown":
      case "keypress":
      case "keyup":
        serializedEvent = event_serializer_1.serializeKeyboardEvent(event);
        break;
      case "input":
      case "change":
      case "blur":
        serializedEvent = event_serializer_1.serializeEventWithTarget(event);
        break;
      case "abort":
      case "afterprint":
      case "beforeprint":
      case "cached":
      case "canplay":
      case "canplaythrough":
      case "chargingchange":
      case "chargingtimechange":
      case "close":
      case "dischargingtimechange":
      case "DOMContentLoaded":
      case "downloading":
      case "durationchange":
      case "emptied":
      case "ended":
      case "error":
      case "fullscreenchange":
      case "fullscreenerror":
      case "invalid":
      case "languagechange":
      case "levelfchange":
      case "loadeddata":
      case "loadedmetadata":
      case "obsolete":
      case "offline":
      case "online":
      case "open":
      case "orientatoinchange":
      case "pause":
      case "pointerlockchange":
      case "pointerlockerror":
      case "play":
      case "playing":
      case "ratechange":
      case "readystatechange":
      case "reset":
      case "scroll":
      case "seeked":
      case "seeking":
      case "stalled":
      case "submit":
      case "success":
      case "suspend":
      case "timeupdate":
      case "updateready":
      case "visibilitychange":
      case "volumechange":
      case "waiting":
        serializedEvent = event_serializer_1.serializeGenericEvent(event);
        break;
      case "transitionend":
        serializedEvent = event_serializer_1.serializeTransitionEvent(event);
        break;
      default:
        throw new exceptions_1.BaseException(eventName + " not supported on WebWorkers");
    }
    async_1.ObservableWrapper.callEmit(this._sink, {
      "element": this._serializer.serialize(element, serializer_1.RenderStoreObject),
      "eventName": eventName,
      "eventTarget": eventTarget,
      "event": serializedEvent
    });
    return false;
  };
  return EventDispatcher;
})();
exports.EventDispatcher = EventDispatcher;
