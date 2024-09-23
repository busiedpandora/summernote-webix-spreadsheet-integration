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

    function insertImageToSummernote(imageBlob, imageStates) {
        const url = URL.createObjectURL(imageBlob)
        
    }

    function letterToNumber(letter) {
        return letter.toUpperCase().charCodeAt(0) - 64;
    }

    function captureSelectedArea(startCell, endCell) {
        const selectionLayer = document.querySelector('.webix_ss_body .webix_ss_center .webix_area_selection_layer');

        if (selectionLayer) {
            const gridContainer = selectionLayer.closest('.webix_ss_center')

            if (gridContainer) {
                const selectionLayerTop = selectionLayer.querySelector('.webix_area_selection_top');
                const selectionLayerLeft = selectionLayer.querySelector('.webix_area_selection_left');

                const selectionTopStartPosition = selectionLayerTop.style.top
                const selectionLeftStartPosition = selectionLayerLeft.style.left
                const selectionWidth = selectionLayerTop.style.width
                const selectionHeight = selectionLayerLeft.style.height

                const grid = gridContainer.querySelector('.webix_ss_center_scroll')
                
                if (grid) {
                    console.log(grid)
                    const gridSelected = grid.cloneNode(false)

                    const startColumn = letterToNumber(startCell[0])
                    const startRow = startCell.substring(1)
                    const endColumn = letterToNumber(endCell[0])
                    const endRow = endCell.substring(1)
                    
                    for (let i = startColumn; i <= endColumn; i++) {
                        const column = grid.querySelector(`[column="${i}"]`)
                        if(column) {
                            const columnCopy = column.cloneNode(false)

                            const columnLeftFloat = parseFloat(columnCopy.style.left) || 0
                            const selectionLeftFloat = parseFloat(selectionLeftStartPosition) || 0
                            columnCopy.style.left = `${columnLeftFloat - selectionLeftFloat}px`

                            for (let j = startRow; j <= endRow; j++) {
                                const gridCell = column.querySelector(`[aria-rowindex="${j}"]`)
                                if (gridCell) {
                                    columnCopy.appendChild(gridCell.cloneNode(true))
                                }
                            }
                            
                            gridSelected.appendChild(columnCopy)
                        }
                    }

                    gridSelected.style.width = selectionWidth
                    gridSelected.style.height = selectionHeight

                    console.log(gridSelected)

                    document.body.appendChild(gridSelected)

                    html2canvas(gridSelected, {
                    
                    }).then(function (canvas) {
                        document.body.removeChild(gridSelected)

                        // Generate the image
                        const image = canvas.toDataURL("image/png");
                
                        /*
                        // Here you can do something with the image, like saving it
                        const link = document.createElement("a");
                        link.href = image;
                        link.download = "spreadsheet_screenshot.png";
                        link.click();*/
                    })
                }
            }
            
        }
    }

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
                                    onItemClick: () => {
                                        const spreadsheet = $$("spreadsheet-editor")
                                        const selectedRange = spreadsheet.getSelectedRange()

                                        if(selectedRange) {
                                            console.log(selectedRange)

                                            const range = selectedRange.split(":")
                                            const startCell = range[0]
                                            const endCell = range[1]

                                            captureSelectedArea(startCell, endCell)
                                        }
                                        else {
                                            alert("No cells selected!")
                                        }


                                        
                                        
                                    }

                                    },
                                },
                                {
                                    view: "button",
                                    css: "webix_danger",
                                    value: "Close without saving",
                                    on: {
                                        onItemClick: () => {
                                            const confirm_close = window.confirm("Are you sure you want to close the editor?" + 
                                                "All unsaved changes will be lost.")
    
                                            if (confirm_close)
                                            {
                                                $$("spreadsheet-window").close()
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