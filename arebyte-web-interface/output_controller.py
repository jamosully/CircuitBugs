import printer_functions as printer
import svg_functions as svg_funcs
import datetime

LOGO_FILEPATH = "logos/logo.png"
DEFAULT_END_TEXT = "Thank you for visiting!\n arebyte.com"

def generate_interation(svg_filepath: str,
                        circuit_name: str):

    # Create an output png
    path_parts = svg_filepath.split("/")
    circuit_name = path_parts[-1].split(".")[0]
    output_png = "generated_images/pngs/" + circuit_name + ".png"
    svg_funcs.convert_to_png(svg_filepath, output_png)

    items = [
        {
            "filepath": output_png,
            "type": "png",
            "additional_text": [
                circuit_name,
                "YOUR TEXT HERE"
            ]
        }
    ]

    produce_printout(items)    

def produce_printout(items: list,
                     n_line_spacing=1):
    
    """
    Creates a print out for the visitor once they have completed the survey

    items should contain a list of dictionaries with the filepath of each
    item to be added to the dictionary
    """

    # Setup printer
    printer_settings = printer.get_printer_settings("printer_settings.json")
    receipt_printer = printer.setup_printer(printer_settings)

    for item in items:
        if "filepath" in item.keys():
            if item["type"] == "png":
                printer.print_image(receipt_printer,
                                    item["filepath"],
                                    printer_settings)
                if "additional_text" in item.keys():
                    receipt_printer.print_and_feed(n_line_spacing)
                    for line in item["additional_text"]:
                        printer.print_message(receipt_printer,
                                              line)
            elif item["type"] == "txt":
                with open(item["filepath"], "r") as txt_file:
                    printer.print_message(receipt_printer,
                                          txt_file.read())
        elif "string" in item.keys():
            printer.print_message(receipt_printer,
                                  item["string"])
        
        # Add extra lines between sections
        receipt_printer.print_and_feed(n_line_spacing)
            
    # Print the local and welcome text
    printer.print_image(receipt_printer,
                        LOGO_FILEPATH,
                        printer_settings)
    
    receipt_printer.print_and_feed(n_line_spacing)

    printer.print_message(receipt_printer,
                          DEFAULT_END_TEXT)
    
    receipt_printer.print_and_feed(n_line_spacing)

    printer.print_message(receipt_printer,
                          datetime.datetime.strftime(datetime.datetime.now(),
                                                     "%d/%m/%Y, %H:%M:%S"))
    
    receipt_printer.cut()

# produce_printout([{"filepath": "generated_images\\pngs\\6PDQGD.png",
#                    "type": "png",
#                    "additional_text": ["Hello"]}])

# generate_interation("generated_images\\svgs\\6PDQGD.svg")