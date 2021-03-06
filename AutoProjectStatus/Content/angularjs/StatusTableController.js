﻿(function () {
    //Main App
    var app = angular.module("StatusTableModule", []);



    //Status Table Controller
    var StatusTableController = function ($scope, $http, $window, $filter) {

        //function to return proper date format
        function ToJavaScriptDate(value) {
            var pattern = /Date\(([^)]+)\)/;
            var results = pattern.exec(value);
            if (results) {
                var dt = new Date(parseFloat(results[1]));
                return (dt.getMonth() + 1) + "/" + dt.getDate() + "/" + dt.getFullYear();
            }
        }

        //Filtering 
        // set the default sort type 
        $scope.sortType = 'PROJECT_PRIORITY';

        // set the default sort order 
        $scope.sortReverse = false;

        // set the default search/filter term
        $scope.projectSearchVal = { PROJECT_NAME: '', OPEN_STATUS: '' };



        //Set the data returned to a scope variable
        var setStatusListScope = function (statusList) {

            //Use ToJavascriptDate function to convert date to 'MM/dd/yyyy'
            for (var i = 0; i < statusList.data.length; i++) {
                statusList.data[i].START_DATE = ToJavaScriptDate(statusList.data[i].START_DATE);
                statusList.data[i].PLANNED_END_DATE = ToJavaScriptDate(statusList.data[i].PLANNED_END_DATE);
                statusList.data[i].ACTUAL_END_DATE = ToJavaScriptDate(statusList.data[i].ACTUAL_END_DATE);
            }

            $scope.statusList = statusList.data;
            console.log($scope.statusList);
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
            if ($('#tabs li a#' + tabNum).hasClass('inactive')) {
                $('#tabs li a.active').removeClass('active');
                $('#tabs li a').addClass('inactive');
                $('#tabs li a#' + tabNum).removeClass('inactive');
                $('#tabs li a#' + tabNum).addClass('active');
            }

            //get table data
            assignClientNameAndGetData();
            $scope.currentPage = 1;
        };

        //Pagination
        $scope.currentPage = 1;
        $scope.pageSize = 25;

        //update number of total pages when filter is applied
        $scope.getNumberPages = function (filteredStatus) {
            //if current page = 1, disable previous button
            if (filteredStatus) {
                if ($scope.currentPage <= 1 && $scope.currentPage < filteredStatus.length / $scope.pageSize) {
                    //add disabled class to previous button
                    $('nav#pagination li#previousButton').addClass('disabled');
                    $('nav#pagination li#previousButton').addClass('inactiveLink');
                    $('nav#pagination li#nextButton').removeClass('disabled');
                    $('nav#pagination li#nextButton').removeClass('inactiveLink');
                }

                //if current page >= numberOfPages, disable next button
                if ($scope.currentPage > 1 && $scope.currentPage >= filteredStatus.length / $scope.pageSize) {
                    $('nav#pagination li#nextButton').addClass('disabled');
                    $('nav#pagination li#nextButton').addClass('inactiveLink');
                    $('nav#pagination li#previousButton').removeClass('disabled');
                    $('nav#pagination li#previousButton').removeClass('inactiveLink');
                }

                //if current page = 1 && current page >= numberOfPage, disable both
                if ($scope.currentPage <= 1 && $scope.currentPage >= filteredStatus.length / $scope.pageSize) {
                    $('nav#pagination li#nextButton').addClass('disabled');
                    $('nav#pagination li#nextButton').addClass('inactiveLink');
                    $('nav#pagination li#previousButton').addClass('disabled');
                    $('nav#pagination li#previousButton').addClass('inactiveLink');
                }


                //if current page < numberOfPages && current Page > 1, enable both buttons 
                if ($scope.currentPage > 1 && $scope.currentPage < filteredStatus.length / $scope.pageSize) {
                    $('nav#pagination li#nextButton').removeClass('disabled');
                    $('nav#pagination li#nextButton').removeClass('inactiveLink');
                    $('nav#pagination li#previousButton').removeClass('disabled');
                    $('nav#pagination li#previousButton').removeClass('inactiveLink');
                }

                return Math.ceil(filteredStatus.length / $scope.pageSize);
            }
        };


        //Clear Search Filter
        $scope.clearSearchFilter = function () {
            // set the default search/filter term
            $scope.projectSearchVal = { PROJECT_NAME: '', OPEN_STATUS: '' };
            $scope.currentPage = 1;
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
                    '<li class="text-left">' + '<b>Project Type: </b>' + this.status.PROJECT_TYPE + '</li>' +
                    '<li class="text-left">' + '<b>Project Status: </b>' + this.status.PROJECT_STATUS + '</li>' +
                    '<li class="text-left">' + '<b>Project Constraints: </b>' + this.status.PROJECT_CONSTRAINTS + '</li>' +
                    '<li class="text-left">' + '<b>Project Comments: </b>' + this.status.PROJECT_COMMENTS + '</li>' +
                    '<li class="text-left">' + '<b>Actual End Date: </b>' + this.status.ACTUAL_END_DATE + '</li>' +
                    '<li class="text-left">' + '<b>Retail Aftersales: </b>' + this.status.RETAIL_AFTERSALES + '</li>' +

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

        //function to create checkboxes for project type list
        function projectTypeListSplit(projectType) {
            if (projectType) {
                if (projectType.includes(',')) {
                    projectType = projectType.split(',');

                    for (var i = 0; i <= projectType.length; i++) {
                        if (projectType[i]) {
                            projectType[i] = projectType[i].trim();
                        }
                    }
                }
            }

            return projectType;
        }

        //function to return a proper date that the input fields can read
        function convertToDate(strDateValue) {
            if (strDateValue) {
                strDateValue = new Date(strDateValue);
            }

            return strDateValue;
        }



        //update editModal with clicked status row values
        $scope.mapToEdit = function (statusList) {

            //clear error message
            $scope.editErrorMessage = "";

            //Put the statusList in a scope variable and then put the scope {{variable}} in the edit modal 
            $scope.editInputValues = statusList;

            //Convert the Project Types to an array to map each value to the corresponding checkbox

            $scope.editInputValues.PROJECT_TYPE = projectTypeListSplit($scope.editInputValues.PROJECT_TYPE);

            //Convert the Date fields to map to the date type input value
            $scope.editInputValues.START_DATE = convertToDate($scope.editInputValues.START_DATE);
            $scope.editInputValues.PLANNED_END_DATE = convertToDate($scope.editInputValues.PLANNED_END_DATE);
            $scope.editInputValues.ACTUAL_END_DATE = convertToDate($scope.editInputValues.ACTUAL_END_DATE);

        };

        //function to get selected Project Types to turn into a comma delimited list for processing
        $scope.editModalProjectTypeList = [];
        $scope.cloneModalProjectTypeList = [];


        $scope.getProjectTypeList = function (modalType) {
            $('#' + modalType + ' input[type=checkbox]').each(function () {
                if (this.checked) {
                    if (modalType === "editModal") {
                        $scope.editModalProjectTypeList.push(this.value);
                    }

                    if (modalType === "cloneModal") {
                        $scope.cloneModalProjectTypeList.push(this.value);
                    }
                    
                }
            });
        };


        //http post to /home/edit/
        $scope.editStatus = function (status) {
            
            $scope.editModalProjectTypeList = [];
            $scope.getProjectTypeList("editModal");

            if (status) {
                var statusToEdit = {
                    SEQ_NUM: status.SEQ_NUM,
                    CLIENT_NAME: status.CLIENT_NAME,
                    PROJECT_PRIORITY: status.PROJECT_PRIORITY,
                    OPEN_STATUS: status.OPEN_STATUS,
                    RETAIL_AFTERSALES: status.RETAIL_AFTERSALES,
                    PROJECT_NAME: status.PROJECT_NAME,
                    PROJECT_COMMENTS: status.PROJECT_COMMENTS,
                    ProjectTypeList: $scope.editModalProjectTypeList,
                    START_DATE: status.START_DATE,
                    PLANNED_END_DATE: status.PLANNED_END_DATE,
                    ACTUAL_END_DATE: status.ACTUAL_END_DATE,
                    PROJECT_DESCRIPTION: status.PROJECT_DESCRIPTION,
                    PROJECT_STATUS: status.PROJECT_STATUS,
                    PROJECT_CONSTRAINTS: status.PROJECT_CONSTRAINTS,
                    SCHEDULE: status.SCHEDULE,
                    BUDGET: status.BUDGET,
                    CLIENT_SATISFACTION: status.CLIENT_SATISFACTION,
                    SCOPE: status.SCOPE,
                    RESOURCES: status.RESOURCES,
                    OTHER_RISK: status.OTHER_RISK
                };
            }

            $http.post("/home/edit/", statusToEdit).then(function (response) {
                console.log(response.data);

                if (response.data.success === "true") {
                    $window.location.href = response.data.redirectURL;
                    $window.location.reload();
                }

                if (response.data.success === "false") {
                    $scope.editErrorMessage = response.data.errorMessage;
                }
            });
        };


        //update cloneModal with clicked status row values
        $scope.mapToClone = function (statusList) {

            $scope.insertErrorMessage = "";

            //Put the statusList in a scope variable and then put the scope {{variable}} in the edit modal 
            $scope.cloneInputValues = statusList;

            //Convert the Project Types to an array to map each value to the corresponding checkbox
            $scope.cloneInputValues.PROJECT_TYPE = projectTypeListSplit($scope.cloneInputValues.PROJECT_TYPE);

            //Convert the Date fields to map to the date type input value
            $scope.cloneInputValues.START_DATE = convertToDate($scope.cloneInputValues.START_DATE);
            $scope.cloneInputValues.PLANNED_END_DATE = convertToDate($scope.cloneInputValues.PLANNED_END_DATE);
            $scope.cloneInputValues.ACTUAL_END_DATE = convertToDate($scope.cloneInputValues.ACTUAL_END_DATE);

        };

        $scope.insertCloneStatus = function (status) {


            $scope.cloneModalProjectTypeList = [];
            $scope.getProjectTypeList("cloneModal");

            if (status) {
                var statusToClone = {
                    SEQ_NUM: status.SEQ_NUM,
                    CLIENT_NAME: status.CLIENT_NAME,
                    PROJECT_PRIORITY: status.PROJECT_PRIORITY,
                    OPEN_STATUS: status.OPEN_STATUS,
                    RETAIL_AFTERSALES: status.RETAIL_AFTERSALES,
                    PROJECT_NAME: status.PROJECT_NAME,
                    PROJECT_COMMENTS: status.PROJECT_COMMENTS,
                    ProjectTypeList: $scope.cloneModalProjectTypeList,
                    START_DATE: status.START_DATE,
                    PLANNED_END_DATE: status.PLANNED_END_DATE,
                    ACTUAL_END_DATE: status.ACTUAL_END_DATE,
                    PROJECT_DESCRIPTION: status.PROJECT_DESCRIPTION,
                    PROJECT_STATUS: status.PROJECT_STATUS,
                    PROJECT_CONSTRAINTS: status.PROJECT_CONSTRAINTS,
                    SCHEDULE: status.SCHEDULE,
                    BUDGET: status.BUDGET,
                    CLIENT_SATISFACTION: status.CLIENT_SATISFACTION,
                    SCOPE: status.SCOPE,
                    RESOURCES: status.RESOURCES,
                    OTHER_RISK: status.OTHER_RISK
                };
            }

            $http.post("/home/cloneinsert/", statusToClone).then(function (response) {
                console.log(response.data);

                if (response.data.success === "true") {
                    $window.location.href = response.data.redirectURL;
                    $window.location.reload();
                }

                if (response.data.success === "false") {
                    $scope.insertErrorMessage = response.data.errorMessage;
                }
            });
        };


        //delete and then return back to the Index page using new URL
        $scope.mapToDelete = function (status) {
            if (status) {
                //clear any outstanding error messages
                $scope.deleteErrorMessage = "";
                $scope.deleteSuccessMessage = "";

                //map the status record to the popup modal input fields
                $scope.statusToDelete = status;
            }
        };

        $scope.confirmDelete = function () {
            $scope.deleteSuccessMessage = "Deleting...";
        };

        $scope.deleteStatus = function (status) {
            $http.post("/home/delete/", status).then(function (response) {
                console.log(response.data);

                if (response.data.success === "true") {
                    $window.location.href = response.data.redirectURL;
                    $window.location.reload();
                }

                if (response.data.success === "false") {
                    $scope.deleteSuccessMessage = "";
                    $scope.deleteErrorMessage = "Unable to delete status record. Record may have already been deleted by somebody else.";
                }
            });
        };




    };

    app.filter('startFrom', function () {
        return function (input, startFromNumber) {
            if (input) {
                startFromNumber = +startFromNumber;
                return input.slice(startFromNumber);
            }
        };
    });

    app.controller("StatusTableController", ["$scope", "$http", "$window", "$filter", StatusTableController]);



    //closing app function bracket
}());


