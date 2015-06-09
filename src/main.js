angular.module('mdDateTime', []).directive('timeDatePicker', [
  '$filter', '$sce', '$rootScope', '$parse', 'timeDate', function($filter, $sce, $rootScope, $parse, timeDate){
    var dateFilter;
    dateFilter = $filter('date');
    return {
      restrict: 'AE',
      replace: true,
      scope: {
        modelValue: '=ngModel'
      },
      require: 'ngModel',
      templateUrl: 'src/template.html',
      link: function(scope, element, attrs, ngModel){
        var cancelFn, saveFn;
        scope.crates = timeDate.dates();
        scope.days = timeDate.days();
        var dateRange = scope.$eval(attrs['selectDateRange']);

        scope.dateRange = {
          startDate: new Date(dateRange.startDate),
          endDate: new Date(dateRange.endDate)
        };

        attrs.$observe('defaultMode', function(val){
          if(val !== 'time' && val !== 'date'){
            val = 'date';
          }
          return scope.mode = val;
        });
        attrs.$observe('displayMode', function(val){
          if(val !== 'full' && val !== 'time' && val !== 'date'){
            val = void 0;
          }
          return scope.displayMode = val;
        });
        attrs.$observe('orientation', function(val){
          return scope.verticalMode = val === 'true';
        });
        attrs.$observe('displayTwentyfour', function(val){
          return scope.hours24 = (val != null) && val;
        });
        attrs.$observe('mindate', function(val){
          if((val != null) && angular.isDate(val)){
            return scope.restrictions.mindate = val;
          }
        });
        attrs.$observe('maxdate', function(val){
          if((val != null) && angular.isDate(val)){
            return scope.restrictions.maxdate = val;
          }
        });
        ngModel.$render = function(){
          return scope.setDate(ngModel.$modelValue);
        };
        saveFn = $parse(attrs.onSave);
        cancelFn = $parse(attrs.onCancel);
        scope.save = function(){
          scope.modelValue = scope.date;
          ngModel.$setDirty();
          return saveFn(scope.$parent, {
            $value: scope.date
          });
        };
        return scope.cancel = function(){
          cancelFn(scope.$parent, {});
          return ngModel.$render();
        };
      },
      controller: [
        '$scope', function(scope){
          var i;
          scope.restrictions = {
            mindate: void 0,
            maxdate: void 0
          };
          scope.setDate = function(newVal){
            scope.date = newVal != null ? new Date(newVal) : new Date();
            scope.calendar.year = scope.date.getFullYear();
            scope.calendar.month = scope.date.getMonth();
            scope.clock.minutes = scope.date.getMinutes();
            scope.clock.hours = scope.hours24 ? scope.date.getHours() : scope.date.getHours() % 12;
            if(!scope.hours24 && scope.clock.hours === 0){
              return scope.clock.hours = 12;
            }
          };
          scope.display = {
            fullTitle: function(){
              return dateFilter(scope.date, 'EEEE d MMMM yyyy, h:mm a');
            },
            title: function(){
              if(scope.mode === 'date'){
                return dateFilter(scope.date, (scope.displayMode === 'date' ? 'EEEE' : 'EEEE h:mm a'));
              }
            else{
                return dateFilter(scope.date, 'MMMM d yyyy');
              }
            },
            "super": function(){
              if(scope.mode === 'date'){
                return dateFilter(scope.date, 'MMM');
              }
            else{
                return '';
              }
            },
            main: function(){
              return $sce.trustAsHtml(scope.mode === 'date' ? dateFilter(scope.date, 'd') : (dateFilter(scope.date, 'h:mm')) + "<small>" + (dateFilter(scope.date, 'a')) + "</small>");
            },
            sub: function(){
              if(scope.mode === 'date'){
                return dateFilter(scope.date, 'yyyy');
              }
 else{
                return dateFilter(scope.date, 'HH:mm');
              }
            }
          };
          scope.calendar = {
            month: 0,
            year: 0,
            months: (function(){
              var j, results;
              results = [];
              for(i = j = 0; j <= 11; i = ++j){
                results.push(dateFilter(new Date(0, i), 'MMMM'));
              }
              return results;
            })(),
            offsetMargin: function(){
              return (new Date(this.year, this.month).getDay() * 2.7) + "rem";
            },
            isVisible: function(d){
              return new Date(this.year, this.month, d).getMonth() === this.month;
            },
            "class": function(d){
              className = "";
              if((scope.date != null) && new Date(this.year, this.month, d).getTime() === new Date(scope.date.getTime()).setHours(0, 0, 0, 0)){
                className = className + " selected";
              }
              else
              if(new Date(this.year, this.month, d).getTime() === new Date().setHours(0, 0, 0, 0)){
                className = className + " today";
              }
              else
              if (scope.dateRange.startDate < scope.date && scope.date < scope.dateRange.endDate) {
                className = className + " selected-range";
              }
              return className;
            },
            select: function(d){
              return scope.date.setFullYear(this.year, this.month, d);
            },
            monthChange: function(){
              if((this.year == null) || isNaN(this.year)){
                this.year = new Date().getFullYear();
              }
              scope.date.setFullYear(this.year, this.month);
              if(scope.date.getMonth() !== this.month){
                return scope.date.setDate(0);
              }
            },
            incMonth: function(months){
              this.month += months;
              while(this.month < 0 || this.month > 11){
                if(this.month < 0){
                  this.month += 12;
                  this.year--;
                }
 else{
                  this.month -= 12;
                  this.year++;
                }
              }
              return this.monthChange();
            }
          };
          scope.clock = {
            minutes: 0,
            hours: 0,
            incHours: function(inc){
              this.hours = scope.hours24 ? Math.max(0, Math.min(23, this.hours + inc)) : Math.max(1, Math.min(12, this.hours + inc));
              if(isNaN(this.hours)){
                return this.hours = 0;
              }
            },
            incMinutes: function(inc){
              this.minutes = Math.max(0, Math.min(59, this.minutes + inc));
              if(isNaN(this.minutes)){
                return this.minutes = 0;
              }
            },
            setAM: function(b){
              if(b == null){
                b = !this.isAM();
              }
              if(b && !this.isAM()){
                return scope.date.setHours(scope.date.getHours() - 12);
              }
 else
if(!b && this.isAM()){
                return scope.date.setHours(scope.date.getHours() + 12);
              }
            },
            isAM: function(){
              return scope.date.getHours() < 12;
            }
          };
          scope.$watch('clock.minutes', function(val, oldVal){
            if((val != null) && val !== scope.date.getMinutes() && !isNaN(val) && (0 <= val && val <= 59)){
              return scope.date.setMinutes(val);
            }
          });
          scope.$watch('clock.hours', function(val){
            if((val != null) && !isNaN(val)){
              if(!scope.hours24){
                if(val === 24){
                  val = 12;
                }
 else
if(val === 12){
                  val = 0;
                }
 else
if(!scope.clock.isAM()){
                  val += 12;
                }
              }
              if(val !== scope.date.getHours()){
                return scope.date.setHours(val);
              }
            }
          });
          scope.setNow = function(){
            return scope.setDate();
          };
          scope.mode = 'date';
          scope.modeClass = function(){
            if(scope.displayMode != null){
              scope.mode = scope.displayMode;
            }
            return "" + ((scope.verticalMode != null) && scope.verticalMode ? 'vertical ' : '') + (scope.displayMode === 'full' ? 'full-mode' : scope.displayMode === 'time' ? 'time-only' : scope.displayMode === 'date' ? 'date-only' : scope.mode === 'date' ? 'date-mode' : 'time-mode');
          };
          scope.modeSwitch = function(){
            var ref;
            return scope.mode = (ref = scope.displayMode) != null ? ref : scope.mode === 'date' ? 'time' : 'date';
          };
          return scope.modeSwitchText = function(){
            if(scope.mode === 'date'){
              return 'Clock';
            }
 else{
              return 'Calendar';
            }
          };
        }
      ]
    };
  }
]);

angular.module('mdDateTime')
  .factory('timeDate', function(calendar){

    return {
      dates:dates,
      days: days
    };

    function dates(){
      var dates = [];
      for(var i = calendar.MINDATE, len = calendar.MAXDATE; i <= len; i++){
        dates.push(i);
      }
      return dates;
    }

    function days(){
      return [
        'S',
        'M',
        'T',
        'W',
        'T',
        'F',
        'S'
      ];
    }

  })
  .constant('calendar',{
    MINDATE: 2,
    MAXDATE: 31
  });
