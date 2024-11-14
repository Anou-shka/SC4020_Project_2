import React, { useState } from 'react';
import './CoordinatesInput.css';

const CoordinatesInput = ({ onSubmit, onCancel }) => {
  const [coordinatesInputBuffer, setCoordinatesInputBuffer] = useState({ x: '', y: '' });
  const [error, setError] = useState('');

  const handleCoordinateChange = (event) => {
    const { name, value } = event.target;
    setCoordinatesInputBuffer(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const xValue = parseInt(coordinatesInputBuffer.x, 10);
    const yValue = parseInt(coordinatesInputBuffer.y, 10);

    if (isNaN(xValue) || isNaN(yValue) || xValue < 0 || xValue > 200 || yValue < 0 || yValue > 200) {
      setError('Coordinates must be numbers between 0 and 200.');
    } else {
      setError('');
      onSubmit(xValue, yValue);
    }
  };

  return (
    <div className='coordinates-input'>
      <form onSubmit={handleSubmit}>
        <div className='form'>
          <div className='x'>
            <label>X:</label>
            <input type='text' name='x' value={coordinatesInputBuffer.x} onChange={handleCoordinateChange} />
          </div>
          <div className='y'>
            <label>Y:</label>
            <input type='text' name='y' value={coordinatesInputBuffer.y} onChange={handleCoordinateChange} />
          </div>
        </div>
        {error && <div className='error'>{error}</div>}
        <div className='buttons'>
          <button type="submit">Submit</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CoordinatesInput;