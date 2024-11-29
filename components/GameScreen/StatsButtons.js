import React from "react";
import "./StatsButtons.css";

const StatsButtons = ({ selectedStat, handleStatClick }) => {
  // Define shot-related and non-shot stats
  const shotStats = ["FG Made", "FG Miss", "3pt Made", "3pt Miss", "FT Made", "FT Miss"];
  const nonShotStats = ["Off. Rebound", "Def. Rebound", "Assist", "Turnover", "Steal"];

  return (
    <div className="stats-buttons">
      <div className="stats-row">
        {shotStats.map((stat) => (
          <button
            key={stat}
            className={`stat-button ${selectedStat === stat ? "active" : ""}`}
            onClick={() => handleStatClick(stat)}
          >
            {stat}
          </button>
        ))}
      </div>
      <div className="stats-row">
        {nonShotStats.map((stat) => (
          <button
            key={stat}
            className={`stat-button ${selectedStat === stat ? "active" : ""}`}
            onClick={() => handleStatClick(stat)}
          >
            {stat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StatsButtons;
