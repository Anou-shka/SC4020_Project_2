import torch
import numpy as np
from utils import calculate_displacement

# Load the model 
#model = torch.load('')


def get_suggestions(x, y , city):
    """
    Get suggestions based on the provided x and y coordinates.

    Args:
        x (int): The x coordinate.
        y (int): The y coordinate.

    Returns:
        list: A list of suggestions.
    """
    # Placeholder for model integration, the model should return a list of suggestions in (x,y,category) format
    # Convert predictions to a list of suggestions
    predictions = []#model.predict(x, y)
    suggestions = []
    for prediction in predictions:
        poi = {
            'x': prediction[0].item(),
            'y': prediction[1].item(),
            'category': prediction[2].item(),
            'distance': round(calculate_displacement(x, y, prediction[0].item(), prediction[1].item()) / 2, 2)  # Convert to km
        }
        suggestions.append(poi)

    return suggestions[:10] # Return 10 suggestions