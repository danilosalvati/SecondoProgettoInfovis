var visualization;
$(document).ready(function () {

    $('#myTabs a[href="#base"]').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
        visualization = "base";
        $('#nodes2_wrapper').hide();
    });

    $('#myTabs a[href="#advanced"]').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
        visualization = "advanced";
        $('#nodes2_wrapper').show();
    });
});