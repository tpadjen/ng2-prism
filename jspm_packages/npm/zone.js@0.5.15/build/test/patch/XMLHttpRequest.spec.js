/* */ 
var util_1 = require('../util');
describe('XMLHttpRequest', function() {
  var testZone = global.zone.fork();
  it('should work with onreadystatechange', function(done) {
    var req;
    testZone.run(function() {
      req = new XMLHttpRequest();
      var firstCall = true;
      req.onreadystatechange = function() {
        req.onreadystatechange = null;
        expect(global.zone).toBeDirectChildOf(testZone);
        done();
      };
      req.open('get', '/', true);
    });
    req.send();
  });
  var supportsOnProgress = function() {
    return 'onprogress' in new XMLHttpRequest();
  };
  supportsOnProgress.message = "XMLHttpRequest.onprogress";
  describe('onprogress', util_1.ifEnvSupports(supportsOnProgress, function() {
    it('should work with onprogress', function(done) {
      var req;
      testZone.run(function() {
        req = new XMLHttpRequest();
        req.onprogress = function() {
          req.onprogress = null;
          expect(global.zone).toBeDirectChildOf(testZone);
          done();
        };
        req.open('get', '/', true);
      });
      req.send();
    });
  }));
  it('should preserve other setters', function() {
    var req = new XMLHttpRequest();
    req.open('get', '/', true);
    req.send();
    try {
      req.responseType = 'document';
      expect(req.responseType).toBe('document');
    } catch (e) {
      expect(e.message).toBe('INVALID_STATE_ERR: DOM Exception 11');
    }
  });
  it('should preserve static constants', function() {
    expect(XMLHttpRequest.UNSENT).toEqual(0);
    expect(XMLHttpRequest.OPENED).toEqual(1);
    expect(XMLHttpRequest.HEADERS_RECEIVED).toEqual(2);
    expect(XMLHttpRequest.LOADING).toEqual(3);
    expect(XMLHttpRequest.DONE).toEqual(4);
  });
});
