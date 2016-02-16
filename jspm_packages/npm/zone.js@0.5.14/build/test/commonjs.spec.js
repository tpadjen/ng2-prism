/* */ 
var commonJSExports = require('../lib/zone');
describe('Zone in CommonJS environment', function() {
  it('defines proper exports properties in CommonJS environment', function() {
    expect(commonJSExports.Zone).toBeDefined();
  });
});
