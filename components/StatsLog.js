import React from "react";

const StatsLog = ({ statsLog, setStatsLog }) => {
  const deleteStat = (index) => {
    setStatsLog(statsLog.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h3>Stats Log</h3>
      <ul>
        {statsLog.map((stat, index) => (
          <li key={index}>
            {stat}
            <button onClick={() => deleteStat(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StatsLog;
