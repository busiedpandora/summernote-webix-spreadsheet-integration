(function (factory) {
	// Global define
	if (typeof define === "function" && define.amd)
	{
		// AMD. Register as an anonymous module.
		define(["jquery"], factory);
	}
	else if (typeof module === "object" && module.exports)
	{
		// Node/CommonJS
		module.exports = factory(require("jquery"));
	}
	else
	{
		// Browser globals
		factory(window.jQuery);
	}
} 

(function ($) {

    const openSpreadSheetModal = function(title, width, height, data) {
        webix.ready(function () {
            webix.ui({
                id: "spreadsheet-window",
                view:"window",
                modal: true,
                position: "center",
                head: title,
                width: width,
                height: height,
                resize: true,
                body: {
                    rows: [
                        {
                            view: "toolbar",
                            elements: [
                                {
                                view: "button",
                                css: "webix_primary",
                                value: "Save and close",
                                on: {
                                    
                                    },
                                },
                                {
                                    view: "button",
                                    css: "webix_danger",
                                    value: "Close without saving",
                                    on: {
                                        onItemClick: () => {
                                            const confirm_close = window.confirm("Are you sure you want to close the editor?" + 
                                                "All unsaved changes will be lost.");
    
                                            if (confirm_close)
                                            {
                                                $$("spreadsheet-window").close();
                                            }
                                        },
                                    }
                                }
                            ],
                        },
                        {
                            id: "spreadsheet-editor",
                            view: "spreadsheet",
                            toolbar: "full",
                            data: JSON.parse(data),
                        },
                    ],
                }
            }).show();
        });
    }

    // Register plugin actions
    $.extend($.summernote.plugins, {
        'new_spreadsheet': function (context) {

            const options = context.options
            const width = options.spreadsheet.width === undefined ? 800 : options.spreadsheet.width
            const height = options.spreadsheet.height === undefined ? 800 : options.spreadsheet.height
            const crop = options.spreadsheet.crop === undefined ? true : options.spreadsheet.crop
            const replace = options.spreadsheet.replace === undefined ? true : options.spreadsheet.replace

            context.memo('button.new_spreadsheet', function () {
                const button = $.summernote.ui.button({
                    contents: '<span class="fa fa-child">Insert new spreadsheet</span>',
					tooltip: 'Open the spreadsheet editor and create a new spreadsheet.',
                    click: () => {
                        openSpreadSheetModal("New SpreadSheet", width, height, null)
                    }
                })

                return button.render()
            })
        }
    })
}))