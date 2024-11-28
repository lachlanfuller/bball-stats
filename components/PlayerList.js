import React from "react";

const PlayerList = ({ players, onCourt, setOnCourt }) => {
  const togglePlayer = (player) => {
    if (onCourt.includes(player)) {
      setOnCourt(onCourt.filter((p) => p !== player));
    } else if (onCourt.length < 5) {
      setOnCourt([...onCourt, player]);
    }
  };

  return (
    <div>
      <h3>Player List</h3>
      {players.map((player) => (
        <button
          key={player.name}
          onClick={() => togglePlayer(player)}
          style={{ background: onCourt.includes(player) ? "green" : "red" }}
        >
          {player.name}
        </button>
      ))}
    </div>
  );
};

export default PlayerList;
