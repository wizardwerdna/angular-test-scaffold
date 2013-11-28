# Angular Testing Scaffold

This bower components includes some functions I have found useful for testing angularjs applications.  To use it, simply execute:

```bash
bower install wizardwerdna/angular-test-scaffold jquery --save-dev
```

And then add the following to your karma.config.js list of include files:

```js
'bower-components/jquery/jquery.js',
'bower-components/angular-test-scaffold/*.js',
```

Afterwards, you should be able to simpulate keypresses and the appropriate angular "input" event on an angular element, with the following:

```js
formElement.$type('enter this text into the input form element');

linkElement.$click() # simpulates a click on a link using on-page routing
```

It will also provide a pseudo HEREDOC facility, which is helpful for writing in-line HTML in your tests during tdd driving.  This should not be used in "production" tests, as it will not work with FIREFOX and a number of old-school browsers.  Still, I have found it very helpful in driving out code before pushing the body of the HTML to an include file in angularjs development.

```js
var app;
beforeEach(inject(function($compile, $rootScope){
   app = $compile(HEREDOC(function({/*

     <div>
       <div class="rolls-display"></div>
       <div class="rolls" ng-click="rollsDisplay='-'"></div>
       <div class="reset" ng-click="rollsDisplay=''"></div>
     </div>

   */
   }))($rootScope);
   $rootScope.$digest();
}));
```

Finally, a number of angular-specific jasmine matchers are provided:

```js

expect(actual).to$Equal(expected) # like .toEqual, but using angular.equals

expect(actual).toEqualError(msg)  # compares error messages
expect(actual).toMatchError(msg)
expect(spy).toHaveBeenCalledOnceWith(arguments)
                                  # matches only if called with arguments AND only once
spyOnlyCallsWithArgs(obj, method) # Like spyOn, but ignores calls without arguments, such as getters
expect(item).toBeOneOf(ary)       # works with array-like elements
expect(item).toHaveClass(klass)   # passes item to angular.element to test for class 
expect(e).toBeInvalid()           # form element is invalid
expect(e).toBeValid()             # form element is valid
expect(e).toBeDirty()             # form element is dirty
expect(e).toBePristing()          # form element is pristine
expect(e).toBeShown()             # element is shown, not hidden, using ng directives
expect(e).toBeHidden()            # element is hidden, not shown, using ng directives

```
