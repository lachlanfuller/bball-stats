import React, { useState, useEffect } from "react";
import ClockManager from "./GameScreen/ClockManager";
import PlayerGrid from "./GameScreen/PlayerGrid";
import StatsButtons from "./GameScreen/StatsButtons";
import StatsLog from "./GameScreen/StatsLog";
import Modal from "./Modal";
import EditStatForm from "./EditStatForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import "./GameScreen.css";

const GameScreen = ({ players, onCourt, setOnCourt, gameSetup, setScreen }) => {
  const [gameClock, setGameClock] = useState(gameSetup.periodTime * 60);
  const [isClockRunning, setIsClockRunning] = useState(false);
  const [currentPeriod, setCurrentPeriod] = useState(1);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedStat, setSelectedStat] = useState(null);
  const [statsLog, setStatsLog] = useState([]);
  const [editLogEntry, setEditLogEntry] = useState(null);

  useEffect(() => {
    let timer;
    if (isClockRunning && gameClock > 0) {
      timer = setInterval(() => setGameClock((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isClockRunning, gameClock]);

  const toggleClock = () => setIsClockRunning(!isClockRunning);

  const endPeriod = () => {
    setGameClock(0);
    setIsClockRunning(false);
    if (currentPeriod < gameSetup.periods) {
      setCurrentPeriod((prev) => prev + 1);
      setGameClock(gameSetup.periodTime * 60);
    } else {
      alert("Game over! Review stats or export data.");
      setScreen("setup");
    }
  };

  const handlePlayerClick = (player) => {
    setSelectedPlayer(selectedPlayer === player ? null : player);
    if (selectedStat) recordStat(player, selectedStat);
  };

  const handleStatClick = (stat) => {
    setSelectedStat(selectedStat === stat ? null : stat);
    if (selectedPlayer) recordStat(selectedPlayer, stat);
  };

  const recordStat = (player, stat) => {
    setStatsLog([
      ...statsLog,
      {
        id: Date.now(),
        time: formatTime(gameClock),
        period: currentPeriod,
        player: player.name,
        stat,
      },
    ]);
    setSelectedPlayer(null);
    setSelectedStat(null);
  };

  const editStat = (entry) => setEditLogEntry(entry);

  const saveEdit = (updatedEntry) => {
    setStatsLog(statsLog.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry)));
    setEditLogEntry(null);
  };

  const deleteStat = (id) => setStatsLog(statsLog.filter((entry) => entry.id !== id));

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const exportToCSV = () => {
    const headers = ["Time", "Period", "Player", "Stat"];
    const rows = statsLog.map(({ time, period, player, stat }) => [time, period, player, stat]);
    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "stats_log.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="game-screen">
      <ClockManager
        gameClock={gameClock}
        isClockRunning={isClockRunning}
        toggleClock={toggleClock}
        currentPeriod={currentPeriod}
        endPeriod={endPeriod}
      />
      <PlayerGrid players={players} selectedPlayer={selectedPlayer} handlePlayerClick={handlePlayerClick} />
      <StatsButtons selectedStat={selectedStat} handleStatClick={handleStatClick} />
      <div className="stats-log">
        <h3>Stats Log</h3>
        <ul>
          {statsLog.map((entry) => (
            <li key={entry.id}>
              <div className="log-text">
                {entry.time} - P{entry.period}: {entry.player} - {entry.stat}
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
            </li>
          ))}
        </ul>
      </div>

      <button onClick={exportToCSV}>Export to CSV</button>

      {editLogEntry && (
        <Modal isVisible={!!editLogEntry} onClose={() => setEditLogEntry(null)}>
          <EditStatForm entry={editLogEntry} players={players} saveEdit={saveEdit} onCancel={() => setEditLogEntry(null)} />
        </Modal>
      )}
    </div>
  );
};

export default GameScreen;
