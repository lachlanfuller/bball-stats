import React, { useState, useEffect } from "react";
import "./styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const App = () => {
  const [screen, setScreen] = useState("setup");
  const [players, setPlayers] = useState(() => JSON.parse(localStorage.getItem("players")) || []);
  const [onCourt, setOnCourt] = useState(() => JSON.parse(localStorage.getItem("onCourt")) || []);
  const [gameSetup, setGameSetup] = useState(
    () => JSON.parse(localStorage.getItem("gameSetup")) || { periods: 4, periodTime: 10 }
  );
  const [gameClock, setGameClock] = useState(gameSetup.periodTime * 60);
  const [isClockRunning, setIsClockRunning] = useState(false);
  const [statsLog, setStatsLog] = useState(() => JSON.parse(localStorage.getItem("statsLog")) || []);
  const [modalContent, setModalContent] = useState(null);
  const [pendingStat, setPendingStat] = useState(null); // Holds stat or player for two-click workflow

  useEffect(() => {
    // Save to local storage on changes
    localStorage.setItem("players", JSON.stringify(players));
    localStorage.setItem("onCourt", JSON.stringify(onCourt));
    localStorage.setItem("gameSetup", JSON.stringify(gameSetup));
    localStorage.setItem("statsLog", JSON.stringify(statsLog));
  }, [players, onCourt, gameSetup, statsLog]);

  const addPlayer = (name) => {
    if (name.trim() !== "") {
      setPlayers([...players, { name: name.trim(), stats: {} }]);
    }
  };

  const toggleClock = () => {
    setIsClockRunning(!isClockRunning);
  };

  const startGame = () => {
    setOnCourt(players.slice(0, 5).map((_, index) => index));
    setScreen("game");
  };

  const handleStatClick = (statType) => {
    if (pendingStat) {
      // If pendingStat exists, complete the two-click workflow
      if (typeof pendingStat === "number") {
        // pendingStat is a player, apply the stat
        recordStat(pendingStat, statType);
      }
    } else {
      // First click, set statType as pending
      setPendingStat(statType);
    }
  };

  const handlePlayerClick = (playerIndex) => {
    if (pendingStat) {
      // If pendingStat exists, complete the two-click workflow
      if (typeof pendingStat === "string") {
        // pendingStat is a statType, apply it to the player
        recordStat(playerIndex, pendingStat);
      }
    } else {
      // First click, set playerIndex as pending
      setPendingStat(playerIndex);
    }
  };

  const recordStat = (playerIndex, statType) => {
    const statEntry = {
      player: players[playerIndex].name,
      action: statType,
      time: gameClock,
    };
    setStatsLog([...statsLog, statEntry]);
    setPendingStat(null); // Clear pending stat/player
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const deleteStat = (index) => {
    setStatsLog(statsLog.filter((_, i) => i !== index));
  };

  const openEditModal = (index) => {
    setModalContent({ type: "edit", statIndex: index });
  };

  const confirmEditStat = (index, newPlayer, newAction, newTime) => {
    const updatedLog = [...statsLog];
    updatedLog[index] = {
      ...updatedLog[index],
      player: newPlayer || updatedLog[index].player,
      action: newAction || updatedLog[index].action,
      time: newTime !== undefined ? newTime : updatedLog[index].time,
    };
    setStatsLog(updatedLog);
    setModalContent(null);
  };

  React.useEffect(() => {
    let timer;
    if (isClockRunning) {
      timer = setInterval(() => {
        setGameClock((prev) => {
          if (prev > 0) return prev - 1;
          setIsClockRunning(false);
          return 0;
        });
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isClockRunning]);

  return (
    <div className="container">
      {screen === "setup" && (
        <>
          <h1>Game Setup</h1>
          <div className="game-setup">
            <label>
              <h3>Number of Periods</h3>
              <input
                type="number"
                value={gameSetup.periods}
                onChange={(e) => setGameSetup({ ...gameSetup, periods: parseInt(e.target.value) })}
              />
            </label>
            <label>
              <h3>Minutes per Period</h3>
              <input
                type="number"
                value={gameSetup.periodTime}
                onChange={(e) =>
                  setGameSetup({
                    ...gameSetup,
                    periodTime: parseInt(e.target.value),
                  })
                }
              />
            </label>
          </div>
          <h2>Players</h2>
          <input
            type="text"
            placeholder="Enter player name"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.target.value) {
                addPlayer(e.target.value);
                e.target.value = "";
              }
            }}
          />
          <div className="stats-grid">
            {players.map((player, index) => (
              <div className="player-card" key={index}>
                <h3>{player.name}</h3>
              </div>
            ))}
          </div>
          <button onClick={startGame}>Start Game</button>
        </>
      )}

      {screen === "game" && (
        <>
          <h1>Game Screen</h1>
          <div className="game-clock">
            <h2>Clock: {formatTime(gameClock)}</h2>
            <button onClick={toggleClock}>{isClockRunning ? "Pause" : "Start"}</button>
          </div>
          <div className="game-layout">
            <div className="court-section">
              <h2>Players</h2>
              {players.map((player, index) => (
                <div
                  key={index}
                  className={`player-card ${onCourt.includes(index) ? "on-court" : "on-bench"}`}
                  onClick={() => handlePlayerClick(index)}
                >
                  <h3>{player.name}</h3>
                  <span>{onCourt.includes(index) ? "On Court" : "On Bench"}</span>
                </div>
              ))}
            </div>
            <div className="stats-section">
              <h2>Available Stats</h2>
              {["FG Made", "FG Miss", "Assist", "Offensive Rebound", "Defensive Rebound", "Steal", "Turnover"].map((stat) => (
                <button key={stat} onClick={() => handleStatClick(stat)}>
                  {stat}
                </button>
              ))}
            </div>
          </div>
          <h2>Stats Log</h2>
          <div className="stats-log">
            {statsLog.map((stat, index) => (
              <div key={index} className="stat-entry">
                <span>
                  {formatTime(stat.time)} - {stat.player}: {stat.action}
                </span>
                <div className="stat-actions">
                  <FontAwesomeIcon icon={faEdit} className="icon edit-icon" title="Edit" onClick={() => openEditModal(index)} />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="icon delete-icon"
                    title="Delete"
                    onClick={() => deleteStat(index)}
                  />
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => setScreen("setup")}>Return to Setup</button>
        </>
      )}

      {modalContent && modalContent.type === "edit" && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Stat</h3>
            <label>
              Player:
              <select
                defaultValue={statsLog[modalContent.statIndex].player}
                onChange={(e) => confirmEditStat(modalContent.statIndex, e.target.value, null, null)}
              >
                {players.map((player) => (
                  <option key={player.name} value={player.name}>
                    {player.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Action:
              <select
                defaultValue={statsLog[modalContent.statIndex].action}
                onChange={(e) => confirmEditStat(modalContent.statIndex, null, e.target.value, null)}
              >
                <option value="FG Made">FG Made</option>
                <option value="FG Miss">FG Miss</option>
                <option value="Assist">Assist</option>
                <option value="Offensive Rebound">Offensive Rebound</option>
                <option value="Defensive Rebound">Defensive Rebound</option>
                <option value="Steal">Steal</option>
                <option value="Turnover">Turnover</option>
              </select>
            </label>
            <label>
              Time (seconds):
              <input
                type="number"
                defaultValue={statsLog[modalContent.statIndex].time}
                onChange={(e) => confirmEditStat(modalContent.statIndex, null, null, parseInt(e.target.value))}
              />
            </label>
            <button onClick={() => setModalContent(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
