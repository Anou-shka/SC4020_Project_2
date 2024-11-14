import React, { useEffect, useRef } from 'react';
import './POIList.css';

const POIList = ({ nearestPOI = [], onClose, onClick }) => {
  const poiListRef = useRef(null);

  const handleClickOutside = (event) => {
    if (poiListRef.current && !poiListRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="poi-list-container">
      <div className="poi-list" ref={poiListRef}>
        <h2>🌎Popular spots near you🌎</h2>
        {nearestPOI.length > 0 ? (
          <ul>
            {nearestPOI.map((poi, index) => (
              <li key={index} onClick={() => onClick(poi)}>
                <p>🏷️{poi.category}</p>
                <p>🚗{poi.distance} km away</p>
                <p>📍Coordinates: ({poi.x}, {poi.y})</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No POIs found.</p>
        )}
      </div>
    </div>
  );
};

export default POIList;