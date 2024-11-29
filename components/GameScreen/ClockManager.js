import React from "react";
import "./ClockManager.css";

const ClockManager = ({ gameClock, isClockRunning, toggleClock, currentPeriod, endPeriod }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="clock-manager">
      <h3>Time: {formatTime(gameClock)}</h3>
      <h3>Period: {currentPeriod}</h3>
      <button onClick={toggleClock}>{isClockRunning ? "Pause Clock" : "Start Clock"}</button>
      <button onClick={endPeriod}>End Period</button>
    </div>
  );
};

export default ClockManager;
