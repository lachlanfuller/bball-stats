import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

import "./GameSetup.css";

const GameSetup = ({ players, setPlayers, setScreen, gameSetup, setGameSetup }) => {
  const [newPlayer, setNewPlayer] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editName, setEditName] = useState("");

  const addPlayer = () => {
    if (newPlayer.trim() !== "") {
      setPlayers([...players, { name: newPlayer, isStarter: players.length < 5 }]);
      setNewPlayer("");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent default form behavior
      addPlayer(); // Add player
    }
  };

  const deletePlayer = (index) => {
    const updatedPlayers = players.filter((_, i) => i !== index);
    setPlayers(updatedPlayers);
  };

  const editPlayerName = () => {
    if (editName.trim() !== "") {
      const updatedPlayers = [...players];
      updatedPlayers[editIndex].name = editName;
      setPlayers(updatedPlayers);
      setEditIndex(null);
      setEditName("");
    }
  };

  const toggleStarter = (index) => {
    const updatedPlayers = [...players];
    if (updatedPlayers.length >= 6) {
      updatedPlayers[index].isStarter = !updatedPlayers[index].isStarter;
    }
    setPlayers(updatedPlayers);
  };

  const startGame = () => {
    setScreen("game");
  };

  return (
    <div className="game-setup">
      <h2>Game Setup</h2>

      {/* Player Input */}
      <div className="add-player">
        <input
          type="text"
          placeholder="Enter Player Name"
          value={newPlayer}
          onChange={(e) => setNewPlayer(e.target.value)}
          onKeyDown={handleKeyPress} // Allow adding player on Enter key
        />
        <button onClick={addPlayer}>Add Player</button>
      </div>

      {/* Player List */}
      <div className="player-grid">
        {players.map((player, index) => (
          <div key={index} className={`player-tile ${player.isStarter ? "starter" : "bench"}`}>
            {editIndex === index ? (
              <>
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Edit Name" />
                <button onClick={editPlayerName}>Save</button>
                <button onClick={() => setEditIndex(null)}>Cancel</button>
              </>
            ) : (
              <>
                <div
                  className="player-info"
                  onClick={() => toggleStarter(index)}
                  title={`Click to toggle ${player.isStarter ? "bench" : "starter"}`}
                >
                  {player.name}
                  <span className="status">{player.isStarter ? "(Starter)" : "(Bench)"}</span>
                </div>
                <div className="player-actions">
                  <FontAwesomeIcon
                    icon={faEdit}
                    onClick={() => {
                      setEditIndex(index);
                      setEditName(player.name);
                    }}
                  />
                  <FontAwesomeIcon icon={faTrash} onClick={() => deletePlayer(index)} />
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Game Setup Inputs */}
      <div className="game-settings">
        <label>Periods: </label>
        <input
          type="number"
          value={gameSetup.periods}
          onChange={(e) => setGameSetup({ ...gameSetup, periods: Number(e.target.value) })}
        />
        <label>Minutes per Period: </label>
        <input
          type="number"
          value={gameSetup.periodTime}
          onChange={(e) => setGameSetup({ ...gameSetup, periodTime: Number(e.target.value) })}
        />
      </div>

      {/* Start Game Button */}
      <button onClick={startGame} disabled={players.length < 5}>
        Start Game
      </button>
    </div>
  );
};

export default GameSetup;
