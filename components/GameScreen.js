import React, { useState, useEffect } from "react";
import PlayerTile from "./PlayerTile";
import Modal from "./Modal";
import EditStatForm from "./EditStatForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import "./GameScreen.css";
import StatsButtons from "./GameScreen/StatsButtons";
import SubstitutionModal from "./GameScreen/SubstitutionModal";

const GameScreen = ({ players: initialPlayers, gameSetup, setScreen }) => {
  const [players, setPlayers] = useState(initialPlayers.map((player) => ({ ...player, timeOnCourt: 0 })));

  const [onCourt, setOnCourt] = useState(players.slice(0, 5));
  const [bench, setBench] = useState(players.slice(5));

  const [gameClock, setGameClock] = useState(gameSetup.periodTime * 60);
  const [isClockRunning, setIsClockRunning] = useState(false);
  const [currentPeriod, setCurrentPeriod] = useState(1);

  const [statsLog, setStatsLog] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedStat, setSelectedStat] = useState(null);
  const [editLogEntry, setEditLogEntry] = useState(null);

  const [showSubModal, setShowSubModal] = useState(false);
  const PlayerTile = ({ player, onClick, isActive }) => (
    <div className={`player-tile ${isActive ? "active" : ""}`} onClick={onClick}>
      <p>{player.name}</p>
      <p>Time on Court: {player.timeOnCourt}s</p>
    </div>
  );

  const resetTimeOnCourt = () => {
    setOnCourt((prevOnCourt) =>
      prevOnCourt.map((player) => ({
        ...player,
        timeOnCourt: 0,
      }))
    );
  };

  // Update gameClock and timeOnCourt every second when clock is running
  useEffect(() => {
    let timer;
    if (isClockRunning) {
      timer = setInterval(() => {
        setGameClock((prev) => Math.max(prev - 1, 0));

        setOnCourt((prevOnCourt) => {
          const updatedOnCourt = prevOnCourt.map((player) => ({
            ...player,
            timeOnCourt: player.timeOnCourt + 1,
          }));

          // Update players state with updated onCourt data
          setPlayers((prevPlayers) =>
            prevPlayers.map((player) => updatedOnCourt.find((p) => p.name === player.name) || player)
          );

          return updatedOnCourt;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isClockRunning]);

  // Handle period end when gameClock reaches zero
  useEffect(() => {
    if (gameClock === 0 && isClockRunning) {
      setIsClockRunning(false);
      alert("Period ended");
      // You can also automatically trigger end period logic here
    }
  }, [gameClock, isClockRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleSub = (player, target) => {
    if (target === "bench") {
      console.log(`${player.name} played ${player.timeOnCourt}s this stint.`);
      setOnCourt(onCourt.filter((p) => p !== player));
      setBench([...bench, player]);
    } else {
      if (onCourt.length < 5) {
        setBench(bench.filter((p) => p !== player));
        setOnCourt([...onCourt, player]);
      }
    }
  };

  const recordStat = (player, stat) => {
    setStatsLog([
      ...statsLog,
      {
        id: Date.now(),
        time: formatTime(gameClock),
        period: currentPeriod,
        player: player.name,
        stat: stat,
      },
    ]);

    // Reset selections
    setSelectedPlayer(null);
    setSelectedStat(null);
  };

  const handlePlayerClick = (player) => {
    if (selectedPlayer === player) {
      setSelectedPlayer(null); // Deselect player if already selected
    } else {
      setSelectedPlayer(player); // Select the new player
      if (selectedStat) {
        recordStat(player, selectedStat); // Log the stat immediately if stat is selected
      }
    }
  };

  const handleStatClick = (stat) => {
    if (selectedStat === stat) {
      setSelectedStat(null); // Deselect stat if already selected
    } else {
      setSelectedStat(stat); // Select the new stat
      if (selectedPlayer) {
        recordStat(selectedPlayer, stat); // Log the stat immediately if player is selected
      }
    }
  };

  const editStat = (entry) => setEditLogEntry(entry);
  const saveEdit = (updatedEntry) => {
    setStatsLog(statsLog.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry)));
    setEditLogEntry(null);
  };
  const deleteStat = (id) => setStatsLog(statsLog.filter((entry) => entry.id !== id));

  <StatsButtons selectedStat={selectedStat} handleStatClick={handleStatClick} />;

  const exportCombinedCSV = () => {
    const playerHeaders = [
      "Player",
      "Time on Floor",
      "FG (Made/Attempted)",
      "3PT (Made/Attempted)",
      "FT (Made/Attempted)",
      "Total Rebounds",
      "Offensive Rebounds",
      "Defensive Rebounds",
      "Assist",
      "Turnover",
      "Steal",
    ];

    const gameLogHeaders = ["Time", "Period", "Player", "Stat"];

    const groupedStats = {};
    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    players.forEach((player) => {
      groupedStats[player.name] = {
        "Time on Floor": formatTime(player.timeOnCourt),
        FG: { made: 0, attempted: 0 },
        "3PT": { made: 0, attempted: 0 },
        FT: { made: 0, attempted: 0 },
        "Total Rebounds": 0,
        "Offensive Rebounds": 0,
        "Defensive Rebounds": 0,
        Assist: 0,
        Turnover: 0,
        Steal: 0,
      };
    });

    statsLog.forEach(({ player, stat }) => {
      if (groupedStats[player]) {
        const playerStats = groupedStats[player];
        switch (stat) {
          case "FG Made":
            playerStats.FG.made += 1;
            playerStats.FG.attempted += 1;
            break;
          case "FG Miss":
            playerStats.FG.attempted += 1;
            break;
          case "3pt Made":
            playerStats.FG.made += 1;
            playerStats.FG.attempted += 1;
            playerStats["3PT"].made += 1;
            playerStats["3PT"].attempted += 1;
            break;
          case "3pt Miss":
            playerStats.FG.attempted += 1;
            playerStats["3PT"].attempted += 1;
            break;
          case "FT Made":
            playerStats.FT.made += 1;
            playerStats.FT.attempted += 1;
            break;
          case "FT Miss":
            playerStats.FT.attempted += 1;
            break;
          case "Off. Rebound":
            playerStats["Offensive Rebounds"] += 1;
            playerStats["Total Rebounds"] += 1;
            break;
          case "Def. Rebound":
            playerStats["Defensive Rebounds"] += 1;
            playerStats["Total Rebounds"] += 1;
            break;
          case "Assist":
            playerStats.Assist += 1;
            break;
          case "Turnover":
            playerStats.Turnover += 1;
            break;
          case "Steal":
            playerStats.Steal += 1;
            break;
          default:
            break;
        }
      }
    });

    const playerRows = Object.entries(groupedStats).map(([playerName, stats]) => [
      playerName,
      stats["Time on Floor"],
      `${stats.FG.made} / ${stats.FG.attempted}`,
      `${stats["3PT"].made} / ${stats["3PT"].attempted}`,
      `${stats.FT.made} / ${stats.FT.attempted}`,
      stats["Total Rebounds"],
      stats["Offensive Rebounds"],
      stats["Defensive Rebounds"],
      stats.Assist,
      stats.Turnover,
      stats.Steal,
    ]);

    const gameLogRows = statsLog.map(({ time, period, player, stat }) => [time, period, player, stat]);

    const csvContent = [
      "Player Statistics",
      playerHeaders.join(","),
      ...playerRows.map((row) => row.join(",")),
      "",
      "Game Log",
      gameLogHeaders.join(","),
      ...gameLogRows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "combined_stats.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="game-screen nunito-main">
      <div className="game-controls">
        <h3>Time: {formatTime(gameClock)}</h3>
        <h3>Period: {currentPeriod}</h3>
        <button onClick={() => setIsClockRunning(!isClockRunning)}>{isClockRunning ? "Pause Clock" : "Start Clock"}</button>
        <button
          onClick={() => {
            if (currentPeriod < gameSetup.periods) {
              // Not the last period
              alert(`Ending Period ${currentPeriod}. Starting Period ${currentPeriod + 1}.`);

              // Reset the clock to the configured period time
              setGameClock(gameSetup.periodTime * 60);

              // Increment the current period
              setCurrentPeriod((prev) => prev + 1);

              // Stop the clock to allow the user to manually start it
              setIsClockRunning(false);
            } else {
              // Final period
              alert("Game over! Stats are being exported.");

              // Export both stats
              exportCombinedCSV();

              // Optionally navigate to the setup screen or reset the game
              setScreen("setup");
            }
          }}
        >
          End Period
        </button>

        <button onClick={() => setShowSubModal(true)}>Substitute</button>
      </div>

      {showSubModal && (
        <SubstitutionModal onCourt={onCourt} bench={bench} handleSub={handleSub} closeModal={() => setShowSubModal(false)} />
      )}

      <div className="player-grid">
        {onCourt.map((player) => (
          <PlayerTile
            key={player.name}
            player={player}
            onClick={() => handlePlayerClick(player)}
            isActive={selectedPlayer === player}
            showRole={false}
          />
        ))}
      </div>

      <div className="stats-grid">
        {[
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
        ].map((stat) => (
          <button
            key={stat}
            className={`stat-button ${selectedStat === stat ? "active" : ""}`}
            onClick={() => handleStatClick(stat)}
          >
            {stat}
          </button>
        ))}
      </div>

      <div className="stats-log">
        <h3>Stats Log</h3>
        <ul>
          {[...statsLog].reverse().map((entry) => (
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

      <div className="export-buttons">
        <button className="export-btn" onClick={exportCombinedCSV}>
          Export all Stats
        </button>
      </div>

      {editLogEntry && (
        <Modal isVisible={!!editLogEntry} onClose={() => setEditLogEntry(null)}>
          <EditStatForm entry={editLogEntry} players={players} saveEdit={saveEdit} onCancel={() => setEditLogEntry(null)} />
        </Modal>
      )}
    </div>
  );
};

export default GameScreen;
