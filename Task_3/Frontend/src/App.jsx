import React, { useEffect, useState, useRef } from 'react';
import ConfirmationBox from './ConfirmationBox/ConfirmationBox.jsx';
import CoordinatesInput from './CoordinatesInput/CoordinatesInput.jsx';
import POIList from './POIList/POIList.jsx';
import MapFrame from './MapFrame/MapFrame.jsx';
import History from './History/History.jsx';
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

  // Location History
  const [locationHistory, setLocationHistory] = useState([]);
  const [showLocationHistory, setShowLocationHistory] = useState(false);
  const historyRef = useRef(null);


  const handleCityClick = (event) => {
    const temp = event.target.id;
    if (city !== temp) {
      setMessage(`Change to city ${temp}?`);
      setConfirmAction(() => () => {
        setCity(temp);
        setCoordinates({ x: 100, y: 100 });
       
        setLocationHistory([]); // Clear location history when moving to a new city
        setShowConfirmation(false);
      });
      setShowConfirmation(true);
    }
  };

  // Coordinates
  const [coordinates, setCoordinates] = useState({ x: 100, y: 100 });
  const [showCoordinatesInput, setShowCoordinatesInput] = useState(false);

  const clickSetLocation = () => {
    setShowCoordinatesInput(true);
  };

  const handleSetCoordinates = (x, y) => {
    setCoordinates({ x, y });
    setLocationHistory(prevHistory => [...prevHistory, { x, y }]); // Update location history
    setShowCoordinatesInput(false);
  };


  // Suggestions
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const getNextLocation = () => {
    const suggestionsPromise = fetch(`http://localhost:5000/getSuggestions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        city: city,
        coordinates: locationHistory,
      }),
    }).then(response => response.json());

    const nearestPOIPromise = fetch(`http://localhost:5000/getNearestPOI?city=${city}&x=${coordinates.x}&y=${coordinates.y}`)
      .then(response => response.json());

    Promise.all([suggestionsPromise, nearestPOIPromise])
      .then(([suggestionsData, nearestPOIData]) => {
        const suggestions = suggestionsData.suggestions || [];
        const nearestPOIs = nearestPOIData.POIs || [];
        const combinedSuggestions = [...suggestions, ...nearestPOIs];

        const uniqueSuggestions = new Map();
        combinedSuggestions.forEach(poi => {
          const key = `${poi.x},${poi.y},${poi.category}`;
          if (!uniqueSuggestions.has(key)) {
            uniqueSuggestions.set(key, poi);
          }
        });


        setSuggestions(Array.from(uniqueSuggestions.values()));
        setShowSuggestions(true);
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

  // Handle click outside to close location history
  const handleClickOutside = (event) => {
    if (historyRef.current && !historyRef.current.contains(event.target)) {
      setShowLocationHistory(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
          <POIList suggestions={suggestions} onClick={handleSuggestionClick} onClose={closePOIList} />
        </div>
      ) : null}
      {showLocationHistory ? (
        <div className="History" ref={historyRef}>
          <History locationHistory={locationHistory} />
        </div>
      ) : null}
      <div className="city-boxes">
        <div className="city-box" id="A" onClick={handleCityClick}>City A</div>
        <div className="city-box" id="B" onClick={handleCityClick}>City B</div>
        <div className="city-box" id="C" onClick={handleCityClick}>City C</div>
        <div className="city-box" id="D" onClick={handleCityClick}>City D</div>
      </div>

      <MapFrame currentX={coordinates.x} currentY={coordinates.y} />
      <div className="app-buttons">
        <button onClick={clickSetLocation}>Set Location</button>
        <button onClick={() => setShowLocationHistory(true)}>Location History</button>
        <button onClick={getNextLocation}>Next Locations Suggestions</button>
      </div>
    </div>
  );
}

export default App;