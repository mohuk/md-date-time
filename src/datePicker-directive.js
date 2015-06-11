(function(){

  'use strict';

  angular.module('demo', [])
        .directive('datePicker',datePickerFunction);

        function datePickerFunction($compile){
        	return {
        		restrict: 'E',
        		transclude: true,
        		//replace: true,
        		scope:{
         			modelValue: '=ngModel'
           		},
         		//require: 'ngModel',
         		//require: "timeDatePicker",
		 		templateUrl: "src/datePicker-template.html",
		 		compile:function(element, attrs, ngModel){
                	return{
	                	pre:function(scope, iElem, iAttrs){
		            			scope.getDatePicker = DatePickerFunction

        		    			scope.range = {
     	        				startDate: '1-1-15',
     	        				endDate: '2-1-15'
            				}
     						elet()
     						var btn = angular.element(document.getElementsByClassName('btn'))
     						scope.style= {'margin-left': (btn.prop('offsetLeft')-120)+'px' }
     						scope.date = ''
     						function elet(){
      			  				scope.elem = $compile("<div ng-style='{{style}}' ><time-date-picker  ng-model='date' select-date-range='{{range}}'></time-date-picker></div>")(scope);	
     							
     							console.log(scope.elem)
     						}
     						function DatePickerFunction(){
        						btn.after(scope.elem)
     						}//DatePickerFunction
                		}
                	}
		  		},//compile
	        } //return
    }//datePickerFunction
        

}());
