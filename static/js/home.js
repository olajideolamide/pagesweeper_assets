$(function () {
    'use strict';
    // Select2 by showing the search
    $('.select2-show-search').select2({
        minimumResultsForSearch: ''
    });


    $('.advanced-options-anchor').click(function () {
        $('.advanced-options-container').toggle();
        $('.select2-show-search').select2({
            minimumResultsForSearch: ''
        });
    });


});//end doc ready
