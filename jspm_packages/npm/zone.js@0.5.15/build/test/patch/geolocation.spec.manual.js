/* */ 
var util_1 = require('../util');
function supportsGeolocation() {
  return 'geolocation' in navigator;
}
supportsGeolocation.message = 'Geolocation';
describe('Geolocation', util_1.ifEnvSupports(supportsGeolocation, function() {
  var testZone = global.zone.fork();
  it('should work for getCurrentPosition', function(done) {
    testZone.run(function() {
      navigator.geolocation.getCurrentPosition(function(pos) {
        expect(global.zone).toBeDirectChildOf(testZone);
        done();
      });
    });
  });
  it('should work for watchPosition', function(done) {
    testZone.run(function() {
      var watchId;
      watchId = navigator.geolocation.watchPosition(function(pos) {
        expect(global.zone).toBeDirectChildOf(testZone);
        navigator.geolocation.clearWatch(watchId);
        done();
      });
    });
  });
}));
