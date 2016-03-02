/* */ 
var util_1 = require('../util');
describe('FileReader', util_1.ifEnvSupports('FileReader', function() {
  var fileReader;
  var blob;
  var data = 'Hello, World!';
  var testZone = global.zone.fork();
  function supportsEventTargetFns() {
    return FileReader.prototype.addEventListener && FileReader.prototype.removeEventListener;
  }
  supportsEventTargetFns.message = 'FileReader#addEventListener and FileReader#removeEventListener';
  beforeEach(function() {
    fileReader = new FileReader();
    try {
      blob = new Blob([data]);
    } catch (e) {
      var blobBuilder = new global.WebKitBlobBuilder();
      blobBuilder.append(data);
      blob = blobBuilder.getBlob();
    }
  });
  describe('EventTarget methods', util_1.ifEnvSupports(supportsEventTargetFns, function() {
    it('should bind addEventListener listeners', function(done) {
      testZone.run(function() {
        fileReader.addEventListener('load', function() {
          expect(global.zone).toBeDirectChildOf(testZone);
          expect(fileReader.result).toEqual(data);
          done();
        });
      });
      fileReader.readAsText(blob);
    });
    it('should remove listeners via removeEventListener', function(done) {
      var listenerSpy = jasmine.createSpy('listener');
      testZone.run(function() {
        fileReader.addEventListener('loadstart', listenerSpy);
        fileReader.addEventListener('loadend', function() {
          expect(listenerSpy).not.toHaveBeenCalled();
          done();
        });
      });
      fileReader.removeEventListener('loadstart', listenerSpy);
      fileReader.readAsText(blob);
    });
  }));
  it('should bind onEventType listeners', function(done) {
    var listenersCalled = 0;
    testZone.run(function() {
      fileReader.onloadstart = function() {
        listenersCalled++;
        expect(global.zone).toBeDirectChildOf(testZone);
      };
      fileReader.onload = function() {
        listenersCalled++;
        expect(global.zone).toBeDirectChildOf(testZone);
      };
      fileReader.onloadend = function() {
        listenersCalled++;
        expect(global.zone).toBeDirectChildOf(testZone);
        expect(fileReader.result).toEqual(data);
        expect(listenersCalled).toBe(3);
        done();
      };
    });
    fileReader.readAsText(blob);
  });
  it('should have correct readyState', function(done) {
    fileReader.onloadend = function() {
      expect(fileReader.readyState).toBe(FileReader.DONE);
      done();
    };
    expect(fileReader.readyState).toBe(FileReader.EMPTY);
    fileReader.readAsText(blob);
  });
}));
