import React, { useState } from "react";
import "./StatsLog.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

const StatsLog = ({ statsLog, editStat, deleteStat }) => {
  // Initialize state to track visibility of each period's logs
  const [collapsedPeriods, setCollapsedPeriods] = useState({});

  // Toggle collapse state for a given period
  const togglePeriod = (period) => {
    setCollapsedPeriods((prev) => ({
      ...prev,
      [period]: !prev[period],
    }));
  };

  // Group logs by period
  const logsByPeriod = statsLog.reduce((acc, log) => {
    acc[log.period] = acc[log.period] || [];
    acc[log.period].push(log);
    return acc;
  }, {});

  return (
    <div className="stats-log">
      <h3>Stats Log</h3>
      <ul>
        {Object.keys(logsByPeriod).map((period) => (
          <li key={period}>
            {/* Period Header */}
            <div className="period-header" onClick={() => togglePeriod(period)}>
              <FontAwesomeIcon icon={collapsedPeriods[period] ? faChevronDown : faChevronUp} className="period-toggle-icon" />
              Period {period}
            </div>
            {/* Logs for the Period */}
            {!collapsedPeriods[period] &&
              logsByPeriod[period].map((entry) => (
                <div key={entry.id} className="log-entry">
                  <div className="log-text">
                    {entry.time} - {entry.player} - {entry.stat}
                  </div>
                  <div className="log-actions">
                    <FontAwesomeIcon icon={faEdit} className="icon edit-icon" onClick={() => editStat(entry)} title="Edit" />
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="icon delete-icon"
                      onClick={() => deleteStat(entry.id)}
                      title="Delete"
                    />
                  </div>
                </div>
              ))}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StatsLog;
