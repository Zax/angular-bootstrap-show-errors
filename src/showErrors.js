(function() {
  var showErrorsModule = angular.module('ui.bootstrap.showErrors', []);

  showErrorsModule.directive('showErrors', [
    '$timeout', 'showErrorsConfig', '$interpolate', function($timeout, showErrorsConfig, $interpolate) {
          var getTrigger = function(options) {
          var trigger;
          trigger = showErrorsConfig.trigger;
          if (options && (options.trigger != null)) {
              trigger = options.trigger;
          }
          return trigger;
      };
      var getShowSuccess = function(options) {
          var showSuccess;
          showSuccess = showErrorsConfig.showSuccess;
          if (options && (options.showSuccess != null)) {
              showSuccess = options.showSuccess;
          }
          return showSuccess;
      };
      var linkFn = function(scope, el, attrs, formCtrl) {
          var toggleClasses;
          var blurred = false;
          var options = scope.$eval(attrs.showErrors);
          var showSuccess = getShowSuccess(options);
          var trigger = getTrigger(options);
          var inputEl = el[0].querySelector('.form-control[name]');
          var spanIcon = angular.element(el[0].querySelector('.glyphicon.form-control-feedback'));
          var inputNgEl = angular.element(inputEl);
          var inputName = $interpolate(inputNgEl.attr('name') || '')(scope);
          if (!inputName) {
              throw "show-errors element has no child input elements with a 'name' attribute and a 'form-control' class";
          }
          inputNgEl.bind(trigger, function() {
              blurred = true;
              return toggleClasses(formCtrl[inputName].$invalid);
          });
          scope.$watch(function() {
              return formCtrl[inputName] && formCtrl[inputName].$invalid;
          }, function(invalid) {
              if (!blurred) {
                  return null;
              }
              return toggleClasses(invalid);
          });
          scope.$on('show-errors-check-validity', function() {
              return toggleClasses(formCtrl[inputName].$invalid);
          });
          scope.$on('show-errors-reset', function() {
              return $timeout(function() {
                  el.removeClass('has-error');
                  el.removeClass('has-success');
                  spanIcon.removeClass('glyphicon-remove');
                  spanIcon.removeClass('glyphicon-ok');
                  return blurred = false;
              }, 0, false);
          });
          return toggleClasses = function(invalid) {
              el.toggleClass('has-error', invalid);
              spanIcon.toggleClass('glyphicon-remove', invalid);
              if (showSuccess) {
                  spanIcon.toggleClass('glyphicon-ok', !invalid);
                  el.toggleClass('has-success', !invalid);
              }
          };
      };
      return {
        restrict: 'A',
        require: '^form',
        compile: function(elem) {
          if (!elem.hasClass('form-group')) {
            throw "show-errors element does not have the 'form-group' class";
          }
          return linkFn;
        }
      };
    }
  ]);

  showErrorsModule.provider('showErrorsConfig', function() {
    var _showSuccess = false;
    var _trigger = 'blur';
    this.showSuccess = function(showSuccess) {
      return _showSuccess = showSuccess;
    };
    this.trigger = function(trigger) {
      return _trigger = trigger;
    };
    this.$get = function() {
      return {
        showSuccess: _showSuccess,
        trigger: _trigger
      };
    };
  });

}).call(this);
