import cairo
import printer_functions as printer

def load_svg(svg_filename, printer_settings):

    height = printer_settings["height"]
    width = printer_settings["width"]

    new_surface = cairo.SVGSurface(svg_filename,
                                   width_in_points=width,
                                   height_in_points=height)