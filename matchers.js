'use strict';
function valueFn(value) {return function() {return value;};}

beforeEach(function() {

  function cssMatcher(presentClasses, absentClasses) {
    return function(util, customEqualityTesters) {
      return {
        compare: function(actual, expected) { 
          var element = angular.element(actual);
          var present = true;
          var absent = false;

          angular.forEach(presentClasses.split(' '), function(className){
            present = present && element.hasClass(className);
          });

          angular.forEach(absentClasses.split(' '), function(className){
            absent = absent || element.hasClass(className);
          });

          var result = {pass: present && !absent}

          if (result.pass) {
            result.message = "Expected not to have " + presentClasses +
                (absentClasses ? (" or to have " + absentClasses + "" ) : "") +
                " but had '" + element[0].className + "'.";
          } else {
            result.message = "Expected to have " + presentClasses +
                (absentClasses ? (" and not have " + absentClasses + "" ) : "") +
                " but had " + element[0].className + ".";
          }

          return result;
        }
      };
    };
  }

  function indexOf(array, obj) {
    for ( var i = 0; i < array.length; i++) {
      if (obj === array[i]) { return i; }
    }
    return -1;
  }

  function isNgElementHidden(element) {
    return angular.element(element).hasClass('ng-hide');
  }

  jasmine.addMatchers({
    toBeStuffy: function(utils, customEqualityTesters){
      return {
        compare: function(actual, expected){
          var result={pass: undefined};
          if (result.pass) {
            result.message = 'not no no no';
          } else {
            result.message = 'yes yes yes';
          }
          return result;
        }
      };
    },
    toBeInvalid: cssMatcher('ng-invalid', 'ng-valid'),
    toBeValid: cssMatcher('ng-valid', 'ng-invalid'),
    toBeDirty: cssMatcher('ng-dirty', 'ng-pristine'),
    toBePristine: cssMatcher('ng-pristine', 'ng-dirty'),
    toBeShown: function(){
      return {
        compare: function(actual){
          var result={pass: !isNgElementHidden(actual)};
          if (result.pass) {
            result.message = "Expected element to have 'ng-hide' class";
          } else {
            result.message = "Expected element not to have 'ng-hide' class";
          }
          return result;
        }
      };
    },
    toBeHidden: function(){
      return {
        compare: function(actual){
          var result={pass: isNgElementHidden(actual)};
          if (result.pass) {
            result.message = "Expected element not to have 'ng-hide' class";
          } else {
            result.message = "Expected element to have 'ng-hide' class";
          }
          return result;
        }
      };
    },

    to$Equal: function() {
      return {
        compare: function(actual, expected){
          return {pass: angular.equals(actual, expected)};
        }
      };
    },

    toHaveBeenCalledOnce: function(util) {
      return {
        compare: function(actual, expected){

          if (!jasmine.isSpy(actual)) {
            return {
              pass: false,
              message: 'Expected a spy, but got ' + jasmine.pp(actual) + '.'
            };
          }

          var count = actual.calls.count();

          var msg = 'Expected spy';

          if (count === 1) { msg += ' not' };

          msg += ' to have been called once, but was';
          switch(count){
            case 0: msg += ' never called.'; break;
            case 1: msg += ' called once.'; break;
            default: msg += ' called ' + actual.calls.count() + ' times.';
          }
          return { pass: count === 1, message: msg };
        }
      };
    },


    toHaveBeenCalledOnceWith: function() {
      var expectedArgs = jasmine.util.argsToArray(arguments);

      if (!jasmine.isSpy(this.actual)) {
        throw new Error('Expected a spy, but got ' + jasmine.pp(this.actual) + '.');
      }

      this.message = function() {
        if (this.actual.callCount !== 1) {
          if (this.actual.callCount === 0) {
            return [
              'Expected spy ' + this.actual.identity + ' to have been called once with ' +
                jasmine.pp(expectedArgs) + ' but it was never called.',
              'Expected spy ' + this.actual.identity + ' not to have been called with ' +
                jasmine.pp(expectedArgs) + ' but it was.'
            ];
          }

          return [
            'Expected spy ' + this.actual.identity + ' to have been called once with ' +
              jasmine.pp(expectedArgs) + ' but it was called ' + this.actual.callCount + ' times.',
            'Expected spy ' + this.actual.identity + ' not to have been called once with ' +
              jasmine.pp(expectedArgs) + ' but it was.'
          ];
        } else {
          return [
            'Expected spy ' + this.actual.identity + ' to have been called once with ' +
              jasmine.pp(expectedArgs) + ' but was called with ' + jasmine.pp(this.actual.argsForCall),
            'Expected spy ' + this.actual.identity + ' not to have been called once with ' +
              jasmine.pp(expectedArgs) + ' but was called with ' + jasmine.pp(this.actual.argsForCall)
          ];
        }
      };

      return this.actual.callCount === 1 && this.env.contains_(this.actual.argsForCall, expectedArgs);
    },


    toBeOneOf: function() {
      return indexOf(arguments, this.actual) !== -1;
    },

    toHaveClass: function(clazz) {
      this.message = function() {
        return "Expected '" + angular.mock.dump(this.actual) + "' to have class '" + clazz + "'.";
      };
      return this.actual.hasClass ?
              this.actual.hasClass(clazz) :
              angular.element(this.actual).hasClass(clazz);
    },

    toThrowMatching: function(expected) {
      /* return jasmine.Matchers.prototype.toThrow.call(this, expected); */
    }
  });
});

// jasmine.Matchers.prototype.toThrow = function(expected) {
//   var result = false;
//   var exception, exceptionMessage;
//   if (typeof this.actual !== 'function') {
//     throw new Error('Actual is not a function');
//   }
//   try {
//     this.actual();
//   } catch (e) {
//     exception = e;
//   }
// 
//   if (exception) {
//     exceptionMessage = exception.message || exception;
//     result = (angular.isUndefined(expected) || this.env.equals_(exceptionMessage, expected.message || expected) || (jasmine.isA_("RegExp", expected) && expected.test(exceptionMessage)));
//   }
// 
//   var not = this.isNot ? "not " : "";
//   var regexMatch = jasmine.isA_("RegExp", expected) ? " an exception matching" : "";
// 
//   this.message = function() {
//     if (exception) {
//       return ["Expected function " + not + "to throw" + regexMatch, expected ? expected.message || expected : "an exception", ", but it threw", exceptionMessage].join(' ');
//     } else {
//       return "Expected function to throw an exception.";
//     }
//   };
// 
//   return result;
// };
// 

/**
 * Create jasmine.Spy on given method, but ignore calls without arguments
 * This is helpful when need to spy only setter methods and ignore getters
 */
function spyOnlyCallsWithArgs(obj, method) {
  var spy = jasmine.spyOn(obj, method);
  obj[method] = function() {
    if (arguments.length) { return spy.apply(this, arguments); }
    return spy.originalValue.apply(this);
  };
  return spy;
}
