from escpos.printer import Usb
import datetime
import json
from PIL import Image

def get_printer_settings(printer_settings_path):

    with open(printer_settings_path, "r") as printer_settings_file:
        return json.load(printer_settings_file)

def setup_printer(printer_settings):

    return Usb(int(printer_settings["vendor_id"], 16),
               int(printer_settings["product_id"], 16), 0)

def print_message(printer, message):
    
    printer.set(align="center")
    
    if "\n" in message:
        printer.text(message)
    else:
        printer.text(message + "\n")

def print_image(printer, image_path, printer_settings):

    img = Image.open(image_path)
    max_width = printer_settings["width"]

    # Check if the image size will fit within the receipt printer
    if img.size[0] > max_width:
        width_percent = max_width / float(img.size[0])
        new_height  = int((float(img.size[1]) * float(width_percent)))
        img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
        img.save(image_path)

    printer.image(image_path, center=True)

printer_settings  = get_printer_settings("printer_settings.json")
printer = setup_printer(printer_settings)
print_image(printer, "circuit.png", printer_settings)
printer.cut()
