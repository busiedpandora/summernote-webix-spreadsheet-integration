$(document).ready(function() {
    $('#editor').summernote({
      height: 400,
      toolbar: [
        ["style", ["bold", "italic", "underline", "clear"]],
        ["font", ["strikethrough", "superscript", "subscript"]],
        ["fontsize", ["fontsize"]],
        ["color", ["color"]],
        ["insert", ["link", "picture", "video"]],
        ["custom", ["new_spreadsheet"]]
      ],
      spreadsheet: {
        width: 800,
        height: 800,
        crop: true,
        replace: true
      },
    });
  });

  



/*
//webix.ready() function ensures that the code will be executed when the page is loaded
webix.ready(function(){
  //object constructor
  webix.ui({
      view:"spreadsheet",
      //loaded data object
      //data: base_data
  });
});*/
  