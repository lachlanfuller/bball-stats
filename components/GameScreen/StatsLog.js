import React from "react";
import "./StatsLog.css";

const StatsLog = ({ statsLog, editStat, deleteStat }) => {
  return (
    <div className="stats-log">
      <h3>Stats Log</h3>
      <ul>
        {statsLog.map((entry) => (
          <li key={entry.id}>
            {entry.time} - P{entry.period}: {entry.player} - {entry.stat}
            <button onClick={() => editStat(entry)}>Edit</button>
            <button onClick={() => deleteStat(entry.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StatsLog;
