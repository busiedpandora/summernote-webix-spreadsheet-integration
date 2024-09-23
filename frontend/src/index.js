// Configure Webix
webix.env.cdn = "https://cdn.webix.com/"; 

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
        width: 1200,
        height: 800,
        crop: true,
        replace: true
      },
    });
  });