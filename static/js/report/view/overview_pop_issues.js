$(function () {
    $("body").on("click", ".list-group-item.issue-line", function () {

        $(".list-group-item.issue-line").removeClass("tx-primary");
        $(".list-group-item.issue-line").removeClass("tx-semibold");

        $(this).addClass("tx-primary");
        $(this).addClass("tx-semibold");
    });





    $("body").on("click", ".issue-page-link", function () {
        var url = $(this).data("url");
        $("#issue-page-modal .main-link").html(url);
        $("#issue-page-modal-trigger").click();

    });







});