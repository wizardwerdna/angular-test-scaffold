'use strict';
function HEREDOC(func) {
  var matches = func.toString().match(/function\s*\(\)\s*\{\s*\/\*\!?\s*([\s\S]+?)\s*\*\/\s*\}/);
  if (!matches) { return false; }
  return matches[1];
}

function ngFromTemplate(templateName, state){
  var html;

  html = htmlFromTemplate(templateName);
  return ngFrom(html, state);
}

function htmlFromTemplate(templateName){
  var html;
  inject(function($templateCache){
    html = $templateCache.get(templateName);
  });
  return html;
}

function ngFrom(html, vm){
  var spa;
  inject(function($compile, $rootScope){
    var scope = $rootScope.$new();
    scope.vm = vm;
    spa = $compile(html)(scope);
    scope.$digest();
  });
  return spa;
}
