$(document).ready(function() {
    $('#editor').summernote({
      height: 400,
      toolbar: [
        ["style", ["bold", "italic", "underline", "clear"]],
        ["font", ["strikethrough", "superscript", "subscript"]],
        ["fontsize", ["fontsize"]],
        ["color", ["color"]],
        ["insert", ["link", "picture", "video"]],
        ["spreadsheet", ["new_spreadsheet"]]
      ],
      spreadsheet: {
        width: 800,
        height: 800,
      },
    });
  });
  