import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';

const ColorPicker = ({ onColorSelect }) => {
  const [color, setColor] = useState('#fff');

  const handleChangeComplete = (color) => {
    setColor(color);
    onColorSelect(color);
  };

  return (
    <div>
      <HexColorPicker
        color={color}
        onChange={handleChangeComplete}
      />
    </div>
  );
};

export default ColorPicker;
