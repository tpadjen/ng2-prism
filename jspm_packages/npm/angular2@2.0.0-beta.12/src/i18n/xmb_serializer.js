/* */ 
'use strict';
var lang_1 = require('../facade/lang');
var message_1 = require('./message');
function serialize(messages) {
  var ms = messages.map(function(m) {
    return _serializeMessage(m);
  }).join("");
  return "<message-bundle>" + ms + "</message-bundle>";
}
exports.serialize = serialize;
function _serializeMessage(m) {
  var desc = lang_1.isPresent(m.description) ? " desc='" + m.description + "'" : "";
  return "<msg id='" + message_1.id(m) + "'" + desc + ">" + m.content + "</msg>";
}
