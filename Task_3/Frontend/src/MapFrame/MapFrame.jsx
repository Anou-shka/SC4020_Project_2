import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import './MapFrame.css';

const Cell = React.memo(({ x, y, offsetX, offsetY, currentX, currentY }) => {
  return (
    <div
      className="cell"
      style={{
        left: `${(x - 1) * 40}px`,
        top: `${(y - 1) * 40}px`,
        transform: `translate(${offsetX}px, ${offsetY}px)`,
        backgroundColor: 'lightgray',
      }}
      title={`(${(x - 1) * 2 + 1}, ${(y - 1) * 2 + 1})`}
    />
  );
});

const Marker = ({ x, y, offsetX, offsetY }) => {
  return (
    <div
      className="marker"
      style={{
        left: `${(x - 1) * 40}px`,
        top: `${(y - 1) * 40}px`,
        transform: `translate(${offsetX}px, ${offsetY}px)`,
      }}
    >
      ⚓
    </div>
  );
};

const MapFrame = ({ currentX, currentY }) => {
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const mapRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.clientX;
    startY.current = e.clientY;
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current;

    setOffsetX((prev) => prev + dx);
    setOffsetY((prev) => prev + dy);

    startX.current = e.clientX;
    startY.current = e.clientY;
  }, []);

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    const mapElement = mapRef.current;
    mapElement.addEventListener('mousemove', handleMouseMove);
    mapElement.addEventListener('mouseup', handleMouseUp);
    mapElement.addEventListener('mouseleave', handleMouseUp);

    return () => {
      mapElement.removeEventListener('mousemove', handleMouseMove);
      mapElement.removeEventListener('mouseup', handleMouseUp);
      mapElement.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [handleMouseMove]);

  useEffect(() => {
    // Center the current location
    const containerWidth = mapRef.current.clientWidth;
    const containerHeight = mapRef.current.clientHeight;
    setOffsetX(containerWidth / 2 - Math.floor((currentX - 1) / 2) * 40 - 20);
    setOffsetY(containerHeight / 2 - Math.floor((currentY - 1) / 2) * 40 - 20);
  }, [currentX, currentY]);

  const cells = useMemo(() => {
    const newCells = [];
    for (let y = 1; y <= 100; y++) {
      for (let x = 1; x <= 100; x++) {
        newCells.push({ x, y });
      }
    }
    return newCells;
  }, []);

  return (
    <div className="map-container" onMouseDown={handleMouseDown} ref={mapRef}>
      {cells.map((cell) => (
        <Cell
          key={`${cell.x}-${cell.y}`}
          x={cell.x}
          y={cell.y}
          offsetX={offsetX}
          offsetY={offsetY}
          currentX={currentX}
          currentY={currentY}
        />
      ))}
      <Marker x={Math.floor((currentX - 1) / 2) + 1} y={Math.floor((currentY - 1) / 2) + 1} offsetX={offsetX} offsetY={offsetY} />
    </div>
  );
};

export default MapFrame;