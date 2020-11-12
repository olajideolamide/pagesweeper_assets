$(function () {
  'use strict'
  $('#wizard2').steps({
    headerTag: 'h3',
    bodyTag: 'section',
    autoFocus: true,
    titleTemplate: '<span class="number">#index#</span> <span class="title">#title#</span>',
    onStepChanging: function (event, currentIndex, newIndex) {
      if (currentIndex < newIndex) {
        // Step 1 form validation
        if (currentIndex === 0) {
          var fname = $('#url').parsley();


          if (fname.isValid()) {
            return true;
          } else {
            fname.validate();

          }
        }

        // Step 2 form validation
        if (currentIndex === 1) {

          return true;

        }

        if (currentIndex === 2) {

          return true;

        }
        // Always allow step back to the previous step even if the current step is not valid.
      } else { return true; }
    },
    onFinished: function (event, currentIndex) {
      submitForm();
    }
  });


  //range slider
  $('.rangeslider1').ionRangeSlider();

  // Datepicker
  $('.fc-datepicker').datepicker({
    showOtherMonths: true,
    selectOtherMonths: true
  });

});

function submitForm() {
  //we load the modal
  $('#working-modal .message').html('Please wait while we setup your project.');
  $('#working-modal').modal({ 'backdrop': 'static' });

  //then we collect a list of all the varaibles..
  var url = $('[name="url"]').val();
  var name = $('[name="name"]').val();
  var user_agent = $('[name="user_agent"]').val();
  var crawl_depth = $('[name="crawl_depth"]').val();
  var obey_robottxt = $('[name="obey_robottxt"]').val();
  var max_pages = $('[name="max_pages"]').val();
  var scan_speed = $('[name="scan_speed"]').val();
  var follow_subdomain = $('[name="follow_subdomain"]').val();
  var expires = $('[name="expires"]').val();

  //we set them inside a form...
  var form_data = new FormData();
  form_data.append(csrf_name, csrf_hash);

  form_data.append("url", url);
  form_data.append("name", name);
  form_data.append("user_agent", user_agent);
  form_data.append("crawl_depth", crawl_depth);
  form_data.append("obey_robottxt", obey_robottxt);
  form_data.append("max_pages", max_pages);
  form_data.append("scan_speed", scan_speed);
  form_data.append("follow_subdomain", follow_subdomain);
  form_data.append("expires", expires);
  form_data.append("submit", "submit");

  //lets roll..

  $.ajax({
    url: app_base_url + 'projects/add_site',
    dataType: 'text',
    cache: false,
    contentType: false,
    processData: false,
    data: form_data,
    type: 'post',
    success: function (response) {
      try {
        $('#working-modal').modal('hide');
        var this_response = $.parseJSON(response);
        //we redirect to the tmp project..
        window.location.replace(app_base_url + this_response.url);
        return;
      }
      catch (ex) {
        $('#working-modal').modal('hide');
        return;
      }
    },
    error: function (response) {
      try {
        var this_response = $.parseJSON(response.responseText);

        $('#working-modal').modal('hide');
        $('#error-modal .message').html(this_response.error_message);
        $('#error-modal').modal({ 'backdrop': 'static' });
        return;
      }
      catch (ex) {
        $('#working-modal').modal('hide');
        return;
      }
    }
  });
}