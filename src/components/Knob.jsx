import React, { useState, useEffect } from "react";
import Draggable from "react-draggable";

const Knob = ({
  label = "",
  value = 0,
  minValue,
  maxValue,
  onChange,
  onToggle = () => {},
}) => {
  const [angle, setAngle] = useState(0);
  const [isOn, setIsOn] = useState(false);

  const draghandler = (event, ui) => {
    const newAngle = angle + ui.deltaX;
    if (newAngle >= -135 && newAngle <= 135) {
      setAngle(newAngle);
      const range = maxValue - minValue;
      const percentage = (newAngle + 135) / 270;
      const newValue = minValue + range * percentage;
      //Round to 2 decimal places
      onChange(Math.round(newValue * 100) / 100);

      //onChange(newValue);
    }
  };

  const togglehandler = () => {
    setIsOn(!isOn);
    onToggle(!isOn);
  };

  useEffect(() => {
    const range = maxValue - minValue;
    const percentage = (value - minValue) / range;
    const newAngle = percentage * 270 - 135;
    setAngle(newAngle);
  }, [value]);

  return (
    <div className="knob-container">
      {label && <div className="knob-label">{label}</div>}
      <Draggable axis="none" onDrag={draghandler} position={{ x: 0, y: 0 }}>
        <div className="knob-wrapper">
          <div
            className="knob"
            style={{ transform: `rotate(${angle}deg)` }}
          ></div>
        </div>
      </Draggable>
      <div
        className={`toggle flex ${isOn ? "justify-end" : "justify-start"}`}
        onClick={togglehandler}
      >
        <div
          className={`toggle-switch h-3 bg-quinary w-1/2 ${
            isOn ? "on" : "off"
          }`}
        ></div>
      </div>
      <div className="knob-value">{value}</div>
    </div>
  );
};

export default Knob;
