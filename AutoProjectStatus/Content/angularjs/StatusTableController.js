(function () {
    //Main App
    var app = angular.module("StatusTableModule", ['ui.bootstrap']);

    

    //LoginController
    var StatusTableController = function ($scope, $http, $window, $filter) {

        function ToJavaScriptDate(value) {
            var pattern = /Date\(([^)]+)\)/;
            var results = pattern.exec(value);
            if (results) {
                var dt = new Date(parseFloat(results[1]));
                return (dt.getMonth() + 1) + "/" + dt.getDate() + "/" + dt.getFullYear();
            }
        }

        

        //Set the data returned to a scope variable
        var setStatusListScope = function (statusList) {

            //Use ToJavascriptDate function to convert date to 'MM/dd/yyyy'
            for (var i = 0; i < statusList.data.length; i++) {
                statusList.data[i].START_DATE = ToJavaScriptDate(statusList.data[i].START_DATE);
                statusList.data[i].PLANNED_END_DATE = ToJavaScriptDate(statusList.data[i].PLANNED_END_DATE);
                statusList.data[i].ACTUAL_END_DATE = ToJavaScriptDate(statusList.data[i].ACTUAL_END_DATE);
            }

            //scope the output list
            $scope.statusList = statusList.data;

            //pagination
            $scope.viewby = 10;
            $scope.totalItems = statusList.data.length;
            $scope.currentPage = 1;
            $scope.itemsPerPage = $scope.viewby;
            $scope.maxSize = 5; //Number of pager buttons to show

            
            $scope.setPage = function (pageNo) {
                $scope.currentPage = pageNo;
            };




        };

        //set an error message if the data is not available
        var onError = function () {
            $scope.errorMessage = "Cannot retreive data now. Try later.";
        };

        //assign the client name and get the corresponding data
        var assignClientNameAndGetData = function () {
            var clientName = $('#tabs li a.active').text();
            clientName = clientName.replace("&", "and");
            $http.get('/home/getexecutivestatus?clientName=' + clientName).then(setStatusListScope, onError);
        };

        //get hash value from url
        var hash = $window.location.hash;

        if (!hash) {
            //add active class to first tab
            $('#tabs li a#tab1').addClass('active');
            //Add inactive class to all tabs except first
            $('#tabs li a:not(:first)').addClass('inactive');
           
            //get table data
            assignClientNameAndGetData();

        } else {
            //get id of hashed value
            var u = $('#tabs li a[href ="' + hash + '"]').attr('id');
            //make all list items inactive
            $('#tabs li a').addClass('inactive');
            //make hash li a active
            $('#tabs li a' + '#' + u).addClass('active');
            
            //get table data
            assignClientNameAndGetData();
        }

       

        //Update data grid when tab is clicked
        $scope.updateActive = function (tabNum) {
            if ($('#tabs li a#'+tabNum).hasClass('inactive')) {
                $('#tabs li a.active').removeClass('active');
                $('#tabs li a').addClass('inactive');
                $('#tabs li a#' + tabNum).removeClass('inactive');
                $('#tabs li a#' + tabNum).addClass('active');
            }

            //get table data
            assignClientNameAndGetData();

            
            
        };
        
        
    };

    app.filter('startFrom', function () {
        return function (input, start) {
            if (input !== undefined) {
                start = +start; //parse to int
                return input.slice(start);
            }
            
        };
    });

    
        
        

    app.controller("StatusTableController", ["$scope", "$http", "$window", "$filter", StatusTableController]);


   
    

    //closing app function bracket
}());