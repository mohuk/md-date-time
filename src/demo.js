angular.module('demo', ['mdDateTime'])	


 .controller('calendarController',calendarController)

 function calendarController($compile,$scope){
    var vm = this;
    vm.getDatePicker = DatePickerFunction

     $scope.range = {
     	startDate: '1-1-15',
     	endDate: '2-1-15'
     }
     
     vm.btn = angular.element(document.getElementsByClassName('btn'))
     $scope.style= {'margin-left': (vm.btn.prop('offsetLeft')-120)+'px' }
     var elem = $compile("<div ng-style='{{style}}' ><time-date-picker  ng-model='date' select-date-range='{{range}}'></time-date-picker></div>")($scope);
     console.log(elem)
     function DatePickerFunction(){
        vm.btn.after(elem)
      console.log('asd')   
     }
 }

