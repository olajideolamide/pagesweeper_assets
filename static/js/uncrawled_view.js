$(function () {

    checkProjectCrawlStatus();
});

function checkProjectCrawlStatus() {
    
    //we set them inside a form...
    var form_data = new FormData();
   
  
    
  
    //lets roll..
  
    $.ajax({
      url: 'http://localhost:5000/?updateToken='+update_token,
      dataType: 'text',
      cache: false,
      contentType: false,
      processData: false,
      type: 'get',
      success: function (response) {
        try {
            console.log(response)
         alert(response)
         return
        }
        catch (ex) {
        console.log(ex)
          return;
        }
      },
      error: function (response) {
        try {
            console.log(response)
            alert(response)
            return
        }
        catch (ex) {
            console.log(ex)
            return;
        }
      }
    });
  }