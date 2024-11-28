import React from "react";
import PlayerTile from "../PlayerTile";

const PlayerGrid = ({ players, selectedPlayer, handlePlayerClick }) => {
  return (
    <div className="player-grid">
      {players.map((player) => (
        <PlayerTile
          key={player.name}
          player={player}
          onClick={() => handlePlayerClick(player)}
          isActive={selectedPlayer === player}
          showRole={false}
        />
      ))}
    </div>
  );
};

export default PlayerGrid;
