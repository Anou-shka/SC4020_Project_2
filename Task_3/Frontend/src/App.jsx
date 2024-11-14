import React, { useEffect, useState } from 'react';
import ConfirmationBox from './ConfirmationBox/ConfirmationBox.jsx';
import CoordinatesInput from './CoordinatesInput/CoordinatesInput.jsx';
import POIList from './POIList/POIList.jsx';
import Map from './Map/Map.jsx';
import './App.css';

function App() {
  // Confirmation box
  const [message, setMessage] = useState('Confirm action?');
  const [confirmAction, setConfirmAction] = useState(() => () => {});
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleCancel = () => {
    setConfirmAction(() => () => {});
    setShowConfirmation(false);
  };

  // Set City
  const [city, setCity] = useState('A');
  const [selectedCity, setSelectedCity] = useState('');

  // Update POI upon city change
  const updatePOI = (city) => {
    fetch(`http://localhost:5000/getAllPOIs?city=${city}`)
      .then(response => response.json())
      .then(data => setPOI(data.POIs))
      .catch(error => console.error('Error fetching POIs:', error));
  };

  const handleCityClick = (event) => {
    const temp = event.target.id;
    if (city !== temp) {
      setSelectedCity(temp);
      setMessage(`Change to city ${temp}?`);
      setConfirmAction(() => () => {
        setCity(temp);
        setCoordinates({ x: 10, y: 10 });
        updatePOI(temp);
        setShowConfirmation(false);
      });
      setShowConfirmation(true);
    }
  };

  // Fetch POI data on first render
  useEffect(() => {
    updatePOI(city);
  }, [city]);

  // Coordinates
  const [coordinates, setCoordinates] = useState({ x: 10, y: 10 });
  const [showCoordinatesInput, setShowCoordinatesInput] = useState(false);

  const clickSetLocation = () => {
    setShowCoordinatesInput(true);
  };

  const handleSetCoordinates = (x, y) => {
    setCoordinates({ x, y });
    setShowCoordinatesInput(false);
  };

  // Suggestions
  const [POI, setPOI] = useState([]);
  const [nearestPOI, setNearestPOI] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const getNextLocation = () => {
    fetch(`http://localhost:5000/getSuggestions?city=${city}&x=${coordinates.x}&y=${coordinates.y}`)
      .then(response => response.json())
      .then(data => {
        if (data.suggestions && data.suggestions.length > 0) {
          console.log('Suggestions:', data.suggestions);
          setNearestPOI(data.suggestions);
          setShowSuggestions(true);
        } else {
          return fetch(`http://localhost:5000/getNearestPOI?city=${city}&x=${coordinates.x}&y=${coordinates.y}`);
        }
      })
      .then(response => response ? response.json() : null)
      .then(data => {
        if (data) {
          console.log('Nearest POI:', data.POIs);
          setNearestPOI(data.POIs);
          setShowSuggestions(true);
        }
      })
      .catch(error => console.error('Error fetching suggestions or nearest POI:', error));
  };

  const closePOIList = () => {
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (poi) => {
    setMessage(`Go to ${poi.category} at (${poi.x}, ${poi.y})?`);
    setConfirmAction(() => () => {
      handleSetCoordinates(poi.x, poi.y);
      setShowConfirmation(false);
      closePOIList();
    });
    setShowConfirmation(true);
  };

  return (
    <div className="App">
      <div className="header">
        <h1>Current Location: City: {city} , Longitude: {coordinates.x} Latitude: {coordinates.y}</h1>
      </div>
      {showConfirmation ? (
        <div className="modal-overlay">
          <ConfirmationBox message={message} onConfirm={confirmAction} onCancel={handleCancel} />
        </div>
      ) : null}
      {showCoordinatesInput ? (
        <div className="modal-overlay">
          <CoordinatesInput onSubmit={handleSetCoordinates} onCancel={() => setShowCoordinatesInput(false)} />
        </div>
      ) : null}
      {showSuggestions ? (
        <div className="POI">
          <POIList nearestPOI={nearestPOI} onClick={handleSuggestionClick} onClose={closePOIList} />
        </div>
      ) : null}
      <div className="city-boxes">
        <div className="city-box" id="A" onClick={handleCityClick}>City A</div>
        <div className="city-box" id="B" onClick={handleCityClick}>City B</div>
        <div className="city-box" id="C" onClick={handleCityClick}>City C</div>
        <div className="city-box" id="D" onClick={handleCityClick}>City D</div>
      </div>

      <Map currentX={coordinates.x} currentY={coordinates.y} />
      <div className="app-buttons">
        <button onClick={clickSetLocation}>Set Location</button>
        <button onClick={getNextLocation}>Next Locations Suggestions</button>
      </div>
    </div>
  );
}

export default App;