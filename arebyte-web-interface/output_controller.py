import printer_functions as printer
import svg_functions as svg_funcs
import datetime

LOGO_FILEPATH = "logos/logo.png"
DEFAULT_END_TEXT = "Thank you for visiting!\n arebyte.com"

def produce_printout(items: list):
    
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
