import React from 'react';
import './ConfirmationBox.css';

const ConfirmationBox = (props) => {

  return (
    <div id="confirmation-box">
      <div className="message">{props.message}</div>
      <div className="buttons">
        <button onClick={props.onConfirm} className="button">Confirm</button>
        <button onClick={props.onCancel} className="button">Cancel</button>
      </div>
    </div>
  );
};

export default ConfirmationBox;