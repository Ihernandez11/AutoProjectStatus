(function () {
    //Main App
    var app = angular.module("StatusTableModule", ['ui.bootstrap']);

    

    //LoginController
    var StatusTableController = function ($scope, $http, $window) {

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
        

        //functions for show and hide popover on mouseover
        $scope.showPopover = function () {
            
            $('table tbody tr#statusRow' + this.status.SEQ_NUM).popover({
                container: 'body',
                html: true,
                placement: 'top',
                selector: 'table tbody tr td.has-popover',
                template: '<div class="popover status-popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>',
                title: this.status.PROJECT_NAME,
                content: '<div class="container-fluid-popover">' +
                            '<div class= "row">' +
                                '<div class="col-sm-6">' +
                                    '<ul class="list-inline">' +
                                        '<li class="text-nowrap text-left">' + '<b>Project Type: </b>' + this.status.PROJECT_TYPE + '</li>' +
                                        '<li class="text-nowrap text-left">' + '<b>Project Status: </b>' + this.status.PROJECT_STATUS + '</li>' +
                                        '<li class="text-nowrap text-left">' + '<b>Project Constraints: </b>' + this.status.PROJECT_CONSTRAINTS + '</li>' +
                                        '<li class="text-left">' + '<b>Project Comments: </b>' + this.status.PROJECT_COMMENTS + '</li>' +
                                        '<li class="text-nowrap text-left">' + '<b>Actual End Date: </b>' + this.status.ACTUAL_END_DATE + '</li>' +
                                        '<li class="text-nowrap text-left">' + '<b>Retail Aftersales: </b>' + this.status.RETAIL_AFTERSALES + '</li>' +
                                        
                                    '</ul>' +
                                '</div>' +
                                '<div class="col-sm-6">' +
                                    '<ul class="list-inline">' +
                                        '<li class="text-nowrap text-left">' + '<b>Schedule: </b>' + this.status.SCHEDULE + '</li>' +
                                        '<li class="text-nowrap text-left">' + '<b>Budget: </b>' + this.status.BUDGET + '</li>' +
                                        '<li class="text-nowrap text-left">' + '<b>Client Satisfaction: </b>' + this.status.CLIENT_SATISFACTION + '</li>' +
                                        '<li class="text-nowrap text-left">' + '<b>Scope: </b>' + this.status.SCOPE + '</li>' +
                                        '<li class="text-nowrap text-left">' + '<b>Resources: </b>' + this.status.RESOURCES + '</li>' +
                                        '<li class="text-nowrap text-left">' + '<b>Other Risk: </b>' + this.status.OTHER_RISK + '</li>' +
                                    '</ul>' +
                                '</div>' +
                            '</div>' +
                        '</div>'
            });
            $('table tbody tr#statusRow' + this.status.SEQ_NUM).popover('show');
        };

        $scope.hidePopover = function () {
            $('table tbody tr#statusRow' + this.status.SEQ_NUM).popover('hide');
        };

        //update editModal with clicked status row values
        $scope.mapToEdit = function (statusList) {
            
            //Put the statusList in a scope variable and then put the scope {{variable}} in the edit modal 
            $scope.editInputValues = statusList;

            //Convert the Project Types to an array to map each value to the corresponding checkbox
            if ($scope.editInputValues.PROJECT_TYPE.includes(',')) {
                $scope.editInputValues.PROJECT_TYPE = $scope.editInputValues.PROJECT_TYPE.split(','); 

                for (var i = 0; i <= $scope.editInputValues.PROJECT_TYPE.length; i++) {
                    if ($scope.editInputValues.PROJECT_TYPE[i]) {
                        $scope.editInputValues.PROJECT_TYPE[i] = $scope.editInputValues.PROJECT_TYPE[i].trim();
                    }
                }
            }
            
            
            //Convert the Date fields to map to the date type input value
            $scope.editInputValues.START_DATE = new Date($scope.editInputValues.START_DATE);
            $scope.editInputValues.PLANNED_END_DATE = new Date($scope.editInputValues.PLANNED_END_DATE);
            $scope.editInputValues.ACTUAL_END_DATE = new Date($scope.editInputValues.ACTUAL_END_DATE);
            
        };

    };

    

    app.controller("StatusTableController", ["$scope", "$http", "$window", "$filter", StatusTableController]);
    

    //closing app function bracket
}());