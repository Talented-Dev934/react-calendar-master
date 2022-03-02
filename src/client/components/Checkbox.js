import React from 'react';

import '../styles/Checkbox.css';

const Checkbox = (props) => {
  return (
    <div className="Checkbox">
      <input type="checkbox" id={props.id} checked={props.checked} onChange={(event) => props.handleChange(event)} />
    </div>
  );
};

export default Checkbox;
