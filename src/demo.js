angular.module('demo', ['mdDateTime'])
  .controller('appCtrl', controller);

  function controller($compile, $scope){
    $scope.date =  new Date('1-1-14');
    $scope.range = {
      startDate: '1-1-15',
      endDate: '3-1-15'
    }
  }

