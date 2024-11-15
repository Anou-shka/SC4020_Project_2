import torch
import numpy as np
from utils import calculate_displacement

import pandas as pd
import numpy as np 
import torch
import torch.nn as nn
from torch.nn.utils.rnn import pack_padded_sequence, pad_packed_sequence, pad_sequence

# Load the model 

class LSTMModel(nn.Module):
    def __init__(self, input_size=2, hidden_size=64, output_size=2):
        super(LSTMModel, self).__init__()
        self.lstm = nn.LSTM(input_size, hidden_size, batch_first=True)
        self.fc = nn.Linear(hidden_size, output_size)

    def forward(self, x, lengths):
        packed_input = pack_padded_sequence(x, lengths, batch_first=True, enforce_sorted=False)
        packed_output, (hn, cn) = self.lstm(packed_input)
        unpacked_output, _ = pad_packed_sequence(packed_output, batch_first=True)
        out = self.fc(hn[-1])
        return out
    
    
def make_multiple_predictions(input_sequence, num_predictions, city):

    city = city.upper()

    input_tensor = torch.tensor(input_sequence).unsqueeze(0).float() 

    model = LSTMModel()
    model.load_state_dict(torch.load(f'./weights/city{city}.pth'))
    model.eval()

    seq_length = torch.tensor([len(input_sequence)])  

    extended_sequence = input_sequence.copy()

    with torch.no_grad():
        for _ in range(num_predictions):
            predicted_next = model(input_tensor, seq_length)
            predicted_next = predicted_next.squeeze().cpu().numpy()  
            predicted_next = [round(coordinate) for coordinate in predicted_next]  

            extended_sequence.append(predicted_next)

            input_tensor = torch.tensor(extended_sequence[-len(input_sequence):]).unsqueeze(0).float()
            seq_length = torch.tensor([len(input_tensor[0])])

    return extended_sequence


def get_suggestions(history , city):
    """
    Load model based on city
    Get suggestions based on the provided x and y coordinates.

    Args:
        history (list): A list of (x, y) coordinates.
        city (str): The city name.

    

    Returns:
        list: A list of suggestions.
    """

    # Placeholder for model integration, the model should return a list of suggestions in (x,y,category) format
    # Convert predictions to a list of suggestions
    predictions = make_multiple_predictions(history, 5, city)
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