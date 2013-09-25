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
formElement.typeOn('enter this text into the input form element');
```
