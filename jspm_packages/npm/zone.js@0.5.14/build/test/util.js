/*
 * usage:

describe('whatever', run(function () {

}, function () {
  return 'registerElement'
}, 'does not support whatevs'))

 */
function ifEnvSupports(test, block) {
    return function () {
        var message = (test.message || test.name || test);
        if (typeof test === 'string' ? !!window[test] : test()) {
            block();
        }
        else {
            it('should skip the test if the API does not exist', function () {
                console.log('WARNING: skipping ' + message + ' tests (missing this API)');
            });
        }
    };
}
exports.ifEnvSupports = ifEnvSupports;
;
var customMatchers = {
    // Assert that a zone is a child of an other zone
    // usage: `expect(childZone).toBeChildOf(parentZone);`
    toBeChildOf: function () {
        return {
            compare: function (childZone, parentZone) {
                var zone = childZone.parent;
                while (zone) {
                    if (zone === parentZone) {
                        return {
                            pass: true,
                            message: 'The zone [' + childZone.$id + '] is a child of the zone [' + parentZone.$id + ']'
                        };
                    }
                    zone = zone.parent;
                }
                return {
                    pass: false,
                    message: 'The zone [' + childZone.$id + '] is not a child of the zone [' + parentZone.$id + ']'
                };
            }
        };
    },
    toBeDirectChildOf: function () {
        return {
            compare: function (childZone, parentZone) {
                if (childZone.parent === parentZone) {
                    return {
                        pass: true,
                        message: 'The zone [' + childZone.$id + '] is a direct child of the zone [' + parentZone.$id + ']'
                    };
                }
                return {
                    pass: false,
                    message: 'The zone [' + childZone.$id + '] is not a direct child of the zone [' + parentZone.$id + ']'
                };
            }
        };
    }
};
beforeEach(function () {
    jasmine.addMatchers(customMatchers);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3QvdXRpbC50cyJdLCJuYW1lcyI6WyJpZkVudlN1cHBvcnRzIl0sIm1hcHBpbmdzIjoiQUFDQTs7Ozs7Ozs7O0dBU0c7QUFDSCx1QkFBOEIsSUFBSSxFQUFFLEtBQUs7SUFDdkNBLE1BQU1BLENBQUNBO1FBQ0wsSUFBSSxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLENBQUM7UUFDbEQsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLEtBQUssUUFBUSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3ZELEtBQUssRUFBRSxDQUFDO1FBQ1YsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sRUFBRSxDQUFDLGdEQUFnRCxFQUFFO2dCQUNuRCxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixHQUFHLE9BQU8sR0FBRywyQkFBMkIsQ0FBQyxDQUFDO1lBQzVFLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztJQUNILENBQUMsQ0FBQ0E7QUFDSkEsQ0FBQ0E7QUFYZSxxQkFBYSxnQkFXNUIsQ0FBQTtBQUFBLENBQUM7QUFFRixJQUFJLGNBQWMsR0FBRztJQUNuQixpREFBaUQ7SUFDakQsc0RBQXNEO0lBQ3RELFdBQVcsRUFBRTtRQUNYLE1BQU0sQ0FBQztZQUNMLE9BQU8sRUFBRSxVQUFTLFNBQVMsRUFBRSxVQUFVO2dCQUNyQyxJQUFJLElBQUksR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDO2dCQUM1QixPQUFPLElBQUksRUFBRSxDQUFDO29CQUNaLEVBQUUsQ0FBQyxDQUFDLElBQUksS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDO3dCQUN4QixNQUFNLENBQUM7NEJBQ0wsSUFBSSxFQUFFLElBQUk7NEJBQ1YsT0FBTyxFQUFFLFlBQVksR0FBRyxTQUFTLENBQUMsR0FBRyxHQUFHLDRCQUE0QixHQUFHLFVBQVUsQ0FBQyxHQUFHLEdBQUcsR0FBRzt5QkFDNUYsQ0FBQztvQkFDSixDQUFDO29CQUNELElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO2dCQUNyQixDQUFDO2dCQUVELE1BQU0sQ0FBQztvQkFDTCxJQUFJLEVBQUUsS0FBSztvQkFDWCxPQUFPLEVBQUUsWUFBWSxHQUFHLFNBQVMsQ0FBQyxHQUFHLEdBQUcsZ0NBQWdDLEdBQUcsVUFBVSxDQUFDLEdBQUcsR0FBRyxHQUFHO2lCQUNoRyxDQUFDO1lBQ0osQ0FBQztTQUNGLENBQUE7SUFDSCxDQUFDO0lBQ0QsaUJBQWlCLEVBQUU7UUFDakIsTUFBTSxDQUFDO1lBQ0wsT0FBTyxFQUFFLFVBQVMsU0FBUyxFQUFFLFVBQVU7Z0JBQ3JDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQztvQkFDcEMsTUFBTSxDQUFDO3dCQUNMLElBQUksRUFBRSxJQUFJO3dCQUNWLE9BQU8sRUFBRSxZQUFZLEdBQUcsU0FBUyxDQUFDLEdBQUcsR0FBRyxtQ0FBbUMsR0FBRyxVQUFVLENBQUMsR0FBRyxHQUFHLEdBQUc7cUJBQ25HLENBQUM7Z0JBQ0osQ0FBQztnQkFFRCxNQUFNLENBQUM7b0JBQ0wsSUFBSSxFQUFFLEtBQUs7b0JBQ1gsT0FBTyxFQUFFLFlBQVksR0FBRyxTQUFTLENBQUMsR0FBRyxHQUFHLHVDQUF1QyxHQUFHLFVBQVUsQ0FBQyxHQUFHLEdBQUcsR0FBRztpQkFDdkcsQ0FBQztZQUNKLENBQUM7U0FDRixDQUFBO0lBQ0gsQ0FBQztDQUNGLENBQUM7QUFFRixVQUFVLENBQUM7SUFDVCxPQUFPLENBQUMsV0FBVyxDQUFNLGNBQWMsQ0FBQyxDQUFDO0FBQzNDLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiXG4vKlxuICogdXNhZ2U6XG5cbmRlc2NyaWJlKCd3aGF0ZXZlcicsIHJ1bihmdW5jdGlvbiAoKSB7XG5cbn0sIGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuICdyZWdpc3RlckVsZW1lbnQnXG59LCAnZG9lcyBub3Qgc3VwcG9ydCB3aGF0ZXZzJykpXG5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlmRW52U3VwcG9ydHModGVzdCwgYmxvY2spIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbWVzc2FnZSA9ICh0ZXN0Lm1lc3NhZ2UgfHwgdGVzdC5uYW1lIHx8IHRlc3QpO1xuICAgIGlmICh0eXBlb2YgdGVzdCA9PT0gJ3N0cmluZycgPyAhIXdpbmRvd1t0ZXN0XSA6IHRlc3QoKSkge1xuICAgICAgYmxvY2soKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaXQoJ3Nob3VsZCBza2lwIHRoZSB0ZXN0IGlmIHRoZSBBUEkgZG9lcyBub3QgZXhpc3QnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdXQVJOSU5HOiBza2lwcGluZyAnICsgbWVzc2FnZSArICcgdGVzdHMgKG1pc3NpbmcgdGhpcyBBUEkpJyk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59O1xuXG52YXIgY3VzdG9tTWF0Y2hlcnMgPSB7XG4gIC8vIEFzc2VydCB0aGF0IGEgem9uZSBpcyBhIGNoaWxkIG9mIGFuIG90aGVyIHpvbmVcbiAgLy8gdXNhZ2U6IGBleHBlY3QoY2hpbGRab25lKS50b0JlQ2hpbGRPZihwYXJlbnRab25lKTtgXG4gIHRvQmVDaGlsZE9mOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29tcGFyZTogZnVuY3Rpb24oY2hpbGRab25lLCBwYXJlbnRab25lKSB7XG4gICAgICAgIHZhciB6b25lID0gY2hpbGRab25lLnBhcmVudDtcbiAgICAgICAgd2hpbGUgKHpvbmUpIHtcbiAgICAgICAgICBpZiAoem9uZSA9PT0gcGFyZW50Wm9uZSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgcGFzczogdHJ1ZSxcbiAgICAgICAgICAgICAgbWVzc2FnZTogJ1RoZSB6b25lIFsnICsgY2hpbGRab25lLiRpZCArICddIGlzIGEgY2hpbGQgb2YgdGhlIHpvbmUgWycgKyBwYXJlbnRab25lLiRpZCArICddJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgICAgem9uZSA9IHpvbmUucGFyZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBwYXNzOiBmYWxzZSxcbiAgICAgICAgICBtZXNzYWdlOiAnVGhlIHpvbmUgWycgKyBjaGlsZFpvbmUuJGlkICsgJ10gaXMgbm90IGEgY2hpbGQgb2YgdGhlIHpvbmUgWycgKyBwYXJlbnRab25lLiRpZCArICddJ1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgdG9CZURpcmVjdENoaWxkT2Y6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjb21wYXJlOiBmdW5jdGlvbihjaGlsZFpvbmUsIHBhcmVudFpvbmUpIHtcbiAgICAgICAgaWYgKGNoaWxkWm9uZS5wYXJlbnQgPT09IHBhcmVudFpvbmUpIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcGFzczogdHJ1ZSxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdUaGUgem9uZSBbJyArIGNoaWxkWm9uZS4kaWQgKyAnXSBpcyBhIGRpcmVjdCBjaGlsZCBvZiB0aGUgem9uZSBbJyArIHBhcmVudFpvbmUuJGlkICsgJ10nXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgcGFzczogZmFsc2UsXG4gICAgICAgICAgbWVzc2FnZTogJ1RoZSB6b25lIFsnICsgY2hpbGRab25lLiRpZCArICddIGlzIG5vdCBhIGRpcmVjdCBjaGlsZCBvZiB0aGUgem9uZSBbJyArIHBhcmVudFpvbmUuJGlkICsgJ10nXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5iZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xuICBqYXNtaW5lLmFkZE1hdGNoZXJzKDxhbnk+Y3VzdG9tTWF0Y2hlcnMpO1xufSk7XG4iXX0=