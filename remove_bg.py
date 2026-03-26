from PIL import Image
import numpy as np

# Load the image
img = Image.open(r"E:\RameTech-Consultancy-website\public\logo.jpg")
img = img.convert("RGBA")

# Convert to numpy array
data = np.array(img)

# Get RGB values
r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]

# White background pixels (high R, G, B values)
threshold = 240
light_mask = (r > threshold) & (g > threshold) & (b > threshold)

# Apply transparency to white background
data[:,:,3] = np.where(light_mask, 0, data[:,:,3])

# Save as PNG (supports transparency)
output_img = Image.fromarray(data)
output_img.save(r"E:\RameTech-Consultancy-website\public\logo_transparent.png", "PNG")
print("Saved logo_transparent.png with transparent background")
