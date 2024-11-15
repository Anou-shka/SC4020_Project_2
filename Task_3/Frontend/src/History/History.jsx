import React from 'react';
import './History.css';

const History = ({ locationHistory }) => {
  return (
    <div className="history-container">
      <h2>Your visited locations</h2>
      <ul>
        {locationHistory.map((location, index) => (
          <li key={index}>
            Longitude: {location.x}, Latitude: {location.y}
            {index < locationHistory.length - 1 && <p>⬇️</p>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default History;