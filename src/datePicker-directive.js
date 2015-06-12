(function(){

  angular.module('mdDateTime')
    .directive('mdDateTimeWidget', mdDateTimeWidget);

    /* ngInject */
    function mdDateTimeWidget($compile){
      return{
        restrict: 'A',
        link: function(scope, elem, attr){
          scope.selectDateRange = scope[attr['selectDateRange']];
          scope.date = scope[attr['model']] || scope.selectDateRange.startDate;
          var pickerDirective = '<time-date-picker ng-model="date" select-date-range="{{selectDateRange}}"></time-date-picker>';
          var compiledElem = $compile(pickerDirective)(scope);
          var body = angular.element(document.querySelector('body'));
          var isOpen = false;

          elem.bind('click', function(){
             isOpen? closeCalendar() : openCalendar();
             isOpen = !isOpen;
          });

          function openCalendar(){
            body.append(compiledElem);
          }

          function closeCalendar(){
            angular.element(document.querySelector('.time-date')).remove();
          }
        }
      }
    }

}());
