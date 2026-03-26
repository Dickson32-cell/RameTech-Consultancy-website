from PIL import Image
img = Image.open(r"E:\RameTech-Consultancy-website\public\logo.png")
print(f"Size: {img.size}")
print(f"Mode: {img.mode}")
print(f"Format: {img.format}")
if img.mode == 'RGBA':
    print("Has alpha channel (transparency)")
else:
    print("No transparency")
