import torch
import numpy as np
from utils import calculate_displacement

# Load the model 
#model = torch.load('')


def get_suggestions(history , city):
    """
    Load model based on city
    Get suggestions based on the provided x and y coordinates.

    Args:
        coordinates (list): A list of (x, y) coordinates.
        city (str): The city name.

    

    Returns:
        list: A list of suggestions.
    """
    # Placeholder for model integration, the model should return a list of suggestions in (x,y,category) format
    # Convert predictions to a list of suggestions
    predictions = []#model.predict(history, city)
    suggestions = []
    for prediction in predictions:
        suggestion = {
            'x': prediction[0].item(),
            'y': prediction[1].item(),
            'category': prediction[2].item(),
             'distance': round(calculate_displacement(history[-1][0], history[-1][1], prediction[0].item(), prediction[1].item()) / 2, 2)  # Calculate distance based on current location
        }
        suggestions.append(suggestion)

    return suggestions[:10] # Return 10 suggestions