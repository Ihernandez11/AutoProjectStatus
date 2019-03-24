//hide all containers for tabs first
//$('#tabs div.container').hide();

$(document).ready(function () {

    var hash = window.location.hash;
    
    if (!hash) {
        //add active class to first tab
        $('#tabs li a#tab1').addClass('active');
        //Add inactive class to all tabs except first
        $('#tabs li a:not(:first)').addClass('inactive');
        //hide tabs containers
        $('#tabs div.container').hide();
        //get tab number of active tab 
        var t = $('li a.active').attr('id');
        //show active container
        $('#tabs div.container' + '#' + t).show();
    } else {
        //get id of hashed value
        var u = $('#tabs li a[href ="' + hash + '"]').attr('id');
        //make all list items inactive
        $('#tabs li a').addClass('inactive');
        //make hash li a active
        $('#tabs li a' + '#' + u).addClass('active');
        //hide all containers
        $('#tabs div.container').hide();
        //show active container
        var v = $('#tabs li a.active').attr('id');
        $('#tabs div.container' + '#' + v).show();
    }


    //When tabs are clicked, active class should be added to li 
    //and removed from other li
    $('#tabs li a').click(function () {
        if ($(this).hasClass('inactive')) {
            $('#tabs li a.active').removeClass('active');
            $('#tabs li a').addClass('inactive');
            $(this).removeClass('inactive');
            $(this).addClass('active');
            var nt = $('#tabs li a.active').attr('id');
            $('#tabs div.container').hide();
            $('#tabs div.container' + '#' + nt).show();
        }
    });


    //$("button").click(function () {
    //    $.getJSON("demo_ajax_json.js", function (result) {
    //        $.each(result, function (i, field) {
    //            $("div").append(field + " ");
    //        });
    //    });
    //});

    var statusModel;

    function formatDate(date) {
        var year = date.getFullYear(),
            month = date.getMonth() + 1, // months are zero indexed
            day = date.getDate();
        return month + "/" + day + "/" + year;
    }

    
    //When the modal opens, the data should be mapped from the api to the modal
    $('#editModal').on('shown.bs.modal', function (event) {
        var s = event.relatedTarget.dataset.seqnum;
        //var s = button.dataset[seqNum];

        $.getJSON("/Home/GetExecutiveStatus/" + s, function (result) {
            statusModel = result;
        });

        
        $('#editModal input#SEQ_NUM').val(s);
        $('#editModal select#CLIENT_NAME').val(statusModel.CLIENT_NAME);
        $('#editModal input#PROJECT_PRIORITY').val(statusModel.PROJECT_PRIORITY);
        $('#editModal select#OPEN_STATUS').val(statusModel.OPEN_STATUS);
        $('#editModal select#RETAIL_AFTERSALES').val(statusModel.RETAIL_AFTERSALES);
        $('#editModal input#PROJECT_NAME').val(statusModel.PROJECT_NAME);
        //$('#editModal select#PROJECT_TYPE').val(statusModel.PROJECT_TYPE);
        $('#editModal textarea#PROJECT_DESCRIPTION').val(statusModel.PROJECT_DESCRIPTION);
        $('#editModal textarea#PROJECT_COMMENTS').val(statusModel.PROJECT_COMMENTS);
        $('#editModal input#START_DATE').val(formatDate(statusModel.START_DATE));
        $('#editModal input#PLANNED_END_DATE').val(formatDate(statusModel.PLANNED_END_DATE));
        $('#editModal input#ACTUAL_END_DATE').val(formatDate(statusModel.ACTUAL_END_DATE));
        $('#editModal select#PROJECT_CONSTRAINTS').val(statusModel.PROJECT_CONSTRAINTS);
        $('#editModal select#SCHEDULE').val(statusModel.SCHEDULE);
        $('#editModal select#BUDGET').val(statusModel.BUDGET);
        $('#editModal select#CLIENT_SATISFACTION').val(statusModel.CLIENT_SATISFACTION);
        $('#editModal select#SCOPE').val(statusModel.SCOPE);
        $('#editModal select#RESOURCES').val(statusModel.RESOURCES);
        $('#editModal select#OTHER_RISK').val(statusModel.OTHER_RISK);

    });

    //doc.ready closing
});


//$('#insertModal').on('show.bs.modal', function (event) {
//    var button = $(event.relatedTarget); // Button that triggered the modal
//    var clientName = button.data('whatever'); // Extract info from data-* attributes
//    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
//    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
//    var modal = $(this);
//    modal.find('.modal-title').text('Insert New Project');
//    //modal.find('.modal-body input').val(recipient);
//});


//.modal('show');

