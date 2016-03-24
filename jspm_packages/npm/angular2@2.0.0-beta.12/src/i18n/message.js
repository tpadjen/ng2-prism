/* */ 
'use strict';
var lang_1 = require('../facade/lang');
var Message = (function() {
  function Message(content, meaning, description) {
    this.content = content;
    this.meaning = meaning;
    this.description = description;
  }
  return Message;
})();
exports.Message = Message;
function id(m) {
  var meaning = lang_1.isPresent(m.meaning) ? m.meaning : "";
  var content = lang_1.isPresent(m.content) ? m.content : "";
  return lang_1.escape("$ng|" + meaning + "|" + content);
}
exports.id = id;
