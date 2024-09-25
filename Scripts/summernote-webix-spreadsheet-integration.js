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
    function letterToNumber(letter) {
        return parseInt(letter.toUpperCase().charCodeAt(0) - 64, 10);
    }

    function captureSelectedArea(spreadsheet, startCell, endCell) {
        const startColumn = letterToNumber(startCell[0])
        const startRow = parseInt(startCell.substring(1), 10)
        const endColumn = letterToNumber(endCell[0])
        const endRow = parseInt(endCell.substring(1), 10)

        const gridSelected = document.createElement('div')
        gridSelected.classList.add("webix_ss_center_scroll")
        gridSelected.setAttribute("role", "rowgroup")
        gridSelected.style.width = `${(endColumn - startColumn + 1) * 100}px`
        gridSelected.style.height = `${(endRow - startRow + 1) * 36}px`

        const columnDefault = document.createElement('div')
        columnDefault.classList.add("webix_column")
        columnDefault.style.width = "100px"
        columnDefault.style.top = "0px"

        const gridCellDefault = document.createElement('div')
        gridCellDefault.classList.add("webix_cell")
        gridCellDefault.setAttribute("role", "gridcell")
        gridCellDefault.style.height = "36px"

        for (let i = startColumn; i <= endColumn; i++) {
            const column = columnDefault.cloneNode(false)
            column.setAttribute("column", i - startColumn + 1)
            column.style.left = `${(i - startColumn) * 100}px`

            for (let j = startRow; j <= endRow; j++) {
                const gridCell = gridCellDefault.cloneNode(false)
                gridCell.setAttribute("aria-rowindex", j - startRow + 1)
                gridCell.setAttribute("aria-colindex", i - startColumn + 1) 

                const value = spreadsheet.getCellValue(j, i, false)
                if (value) {
                    const div = document.createElement('div')
                    div.innerHTML = value
                    gridCell.appendChild(div)
                }
                
                const style = spreadsheet.getStyle(j, i)
                if (style) {
                    gridCell.classList.add(`${style.id}`)
                }

                column.appendChild(gridCell)
            }

            gridSelected.appendChild(column)
        }

        gridSelected.style.border = "1px solid #EDEFF0"

        return gridSelected
    }

    async function generateImage(selectedArea) {
        const div = document.createElement('div')
        div.style.width = selectedArea.style.width
        div.style.height = selectedArea.style.height

        const styleElements = document.querySelectorAll('style[type="text/css"][media="screen,print"]')
        if (styleElements) {
            const styleElement = styleElements.length > 1 ? styleElements[styleElements.length - 1] : styleElements[0]
            if (styleElement) {
                div.appendChild(styleElement)

                const styleContent = styleElement.textContent
                const match = styleContent.match(/\.wss_(\d+)/)
                if (match && match[1]) {
                    const number = match[1]
                    selectedArea.classList.add(`wss_${number}`)
                }
                else {
                    selectedArea.classList.add("wss_1")
                }
            }
        }
        
        div.appendChild(selectedArea)

        document.body.appendChild(div)
        const canvas = await html2canvas(div)
        document.body.removeChild(div)

        const image = canvas.toDataURL("image/png")
        return image
    }

    function insertNewImageToSummernote(context, imageData, spreadsheetState) {
        const img = document.createElement('img')
        img.src = imageData
        img.setAttribute("data-spreadsheetState", JSON.stringify(spreadsheetState))

        const div = document.createElement('div')
        div.style.marginTop = "20px"
        div.style.marginBottom = "20px"
        div.appendChild(img)

        $(context.$note).summernote("restoreRange")
        $(context.$note).summernote("focus")
        $(context.$note).summernote("insertNode", div)
    }

    function replaceImageInSummernote(context, imageData, oldImage, spreadsheetState) {
        const img = document.createElement('img')
        img.src = imageData
        img.setAttribute("data-spreadsheetState", JSON.stringify(spreadsheetState))

        oldImage.replaceWith(img)
    }

    const openSpreadSheetModal = function(context, title, selectedImage) {
        webix.ready(function () {
            webix.ui({
                id: "spreadsheet-window",
                view:"window",
                modal: true,
                position: "center",
                head: title,
                width: context.options.spreadsheet.width === undefined ? 1200 : context.options.spreadsheet.width,
                height: context.options.spreadsheet.height === undefined ? 800 : context.options.spreadsheet.height,
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

                                        if (selectedRange) {
                                            const range = selectedRange.split(":")
                                            const startCell = range[0]
                                            const endCell = range[1]

                                            const selectedArea = captureSelectedArea(spreadsheet, startCell, endCell)

                                            if (selectedArea) {
                                                generateImage(selectedArea).then(imageData => {
                                                    const spreadsheetState = spreadsheet.serialize({ sheets: true })

                                                    if (selectedImage && context.options.spreadsheet.replace) {
                                                        replaceImageInSummernote(context, imageData, selectedImage, spreadsheetState)
                                                    }
                                                    else {
                                                        insertNewImageToSummernote(context, imageData, spreadsheetState)
                                                    }
                                                    
                                                    $$("spreadsheet-window").close()
                                                });
                                            }                               
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
                            data: selectedImage == null ? null : JSON.parse(selectedImage.attr('data-spreadsheetState'))
                        },
                    ],
                }
            }).show();
        });
    }

    // Register plugin actions
    $.extend($.summernote.plugins, {
        'new_spreadsheet': function (context) {
            context.memo('button.new_spreadsheet', function () {
                const button = $.summernote.ui.button({
                    contents: '<span class="fa fa-child">Insert new spreadsheet</span>',
					tooltip: 'Open the spreadsheet editor and create a new spreadsheet.',
                    click: () => {
                        openSpreadSheetModal(context, "New SpreadSheet", null)
                    }
                })

                return button.render()
            })
        },
        'edit_spreadsheet': function (context) {
            context.memo('button.edit_spreadsheet', function () {
                const button = $.summernote.ui.button({
                    contents: '<span class="fa fa-child">Edit spreadsheet</span>',
					tooltip: 'Open the spreadsheet editor and edit the selected spreadsheet.',
                    click: () => {
                        const selectedImage = $(context.invoke('restoreTarget')) 
                        
                        if (selectedImage && selectedImage.is('img') && selectedImage.attr('data-spreadsheetState')) {
                            $('.note-popover').hide()

                            openSpreadSheetModal(context, "Edit SpreadSheet", selectedImage)
                        }
                        else {
                            window.alert("The selected image is not a spreadsheet!")
                        }
                
                    }
                })

                return button.render()
            })
        }
    })
}))