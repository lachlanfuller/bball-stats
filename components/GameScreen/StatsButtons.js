import React from "react";
import "./StatsButtons.css";

const StatsButtons = ({ selectedStat, handleStatClick }) => {
  const stats = [
    "FG Made",
    "FG Miss",
    "3pt Made",
    "3pt Miss",
    "FT Made",
    "FT Miss",
    "Off. Rebound",
    "Def. Rebound",
    "Assist",
    "Turnover",
    "Steal",
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat) => (
        <button
          key={stat}
          className={`stat-button ${selectedStat === stat ? "active" : ""}`}
          onClick={() => handleStatClick(stat)}
        >
          {stat}
        </button>
      ))}
    </div>
  );
};

export default StatsButtons;
