import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBasketballBall } from "@fortawesome/free-solid-svg-icons";
import "./PlayerTile.css";

const PlayerTile = ({ player, onClick, showRole, isActive }) => {
  return (
    <div className={`player-tile ${isActive ? "active" : ""}`} onClick={onClick} title={`Click to toggle role`}>
      <div className="player-info">
        {player.name}
        {showRole && <span className="status">{player.isStarter ? "(Starter)" : "(Bench)"}</span>}
      </div>
      <FontAwesomeIcon icon={faBasketballBall} className="player-icon" />
    </div>
  );
};

export default PlayerTile;
