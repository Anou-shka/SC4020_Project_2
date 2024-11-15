from flask import Flask, request, jsonify
from flask_cors import CORS
from POI_controller import get_Pois, get_all_POIs
from Suggestion_controller import get_suggestions
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
@app.route('/', methods=['GET'])
def hello():
    return "App running!"

@app.route('/getNearestPOI', methods=['GET'])
def getPOI():
    city = request.args.get('city')
    x = request.args.get('x')
    y = request.args.get('y')

    POIs = get_Pois(city, x, y)
    if not POIs:
        return "City not found", 404
    return jsonify({"POIs": POIs})

@app.route('/getAllPOIs', methods=['GET'])
def getAllPOIs():
    city = request.args.get('city')

    POIs = get_all_POIs(city)
    if not POIs:
        return "City not found", 404
    return jsonify({"POIs": POIs})


@app.route('/getSuggestions', methods=['POST'])
def getSuggestions():
    data = request.get_json()
    city = data.get('city')
    coordinates = data.get('coordinates') #history of coordinates
    print(coordinates)
    if not city or not coordinates:
       suggestions = []
    else:
      # Placeholder for model integration, import suggestion_controller and call the function to get next location suggestion from the model
      suggestions = get_suggestions(coordinates, city)
    return jsonify({"suggestions": suggestions})
# Run the app
if __name__ == '__main__':
    app.run(debug=True)