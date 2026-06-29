import xml.etree.ElementTree as ET
import svgwrite
import cairosvg
from PIL import Image, ImageDraw
import cv2


def concatenate_svg_paths(input_file, output_file):
    # Register namespaces to prevent 'ns0:' prefixing
    ET.register_namespace('', "http://www.w3.org/2000/svg")
    
    tree = ET.parse(input_file)
    root = tree.getroot()
    
    # Extract and join all 'd' string values separated by a space
    all_d_attributes = []
    paths_to_remove = []
    
    for path in root.findall('.//{http://www.w3.org/2000/svg}path'):
        print(path)
        if 'd' in path.attrib:
            all_d_attributes.append(path.attrib['d'])
            paths_to_remove.append(path)
            
    if not all_d_attributes:
        print("No paths found.")
        return

    # Create a brand new combined path element
    combined_d = " ".join(all_d_attributes)
    new_path = ET.Element('{http://www.w3.org/2000/svg}path', d=combined_d, fill="none", stroke="black")
    
    # Clean old paths and inject the new joined path
    for old_path in paths_to_remove:
        # Assumes paths sit directly or indirectly under root; 
        # a safer route finds their immediate parents if nested deeply.
        root.remove(old_path)
        
    root.append(new_path)
    tree.write(output_file)

def add_alpha_mask(input_png, mask_png, output_png):

    mask_im = cv2.imread(mask_png, cv2.IMREAD_UNCHANGED)
    background = cv2.imread(input_png)

    mask_im = cv2.resize(mask_im, (500, 500))
    background = cv2.resize(mask_im, (500, 500))

    _, mask = cv2.threshold(mask_im[:, :, 3], 0, 255, cv2.THRESH_BINARY)
    cv2.imwrite("mask.png", mask)

    background = cv2.multiply(mask, background)

    cv2.imwrite(output_png, background)

def convert_to_png(input_svg, output_png):

    with open(input_svg, "r") as input_svg_file:
        svg2convert = input_svg_file.read()

    cairosvg.svg2png(svg2convert, write_to=output_png)
    
    return output_png