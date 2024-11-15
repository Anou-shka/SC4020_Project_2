import math

def calculate_displacement(x1, y1, x2, y2):
    displacement = math.sqrt((x2 - x1)**2 + (y2 - y1)**2)
    return displacement