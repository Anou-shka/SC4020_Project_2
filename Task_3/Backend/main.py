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


@app.route('/getSuggestions', methods=['GET'])
def getSuggestions():
    city = request.args.get('city')
    city = request.args.get('city')
    x = request.args.get('x')
    y = request.args.get('y')

    if not city or not x or not y:
        return "City and coordinates are required", 400

    # Placeholder for model integration, import suggestion_controller and call the function to get next location suggestion from the model
  
    suggestions = get_suggestions(x, y, city)
    return jsonify({"suggestions": suggestions})

# Run the app
if __name__ == '__main__':
    app.run(debug=True)