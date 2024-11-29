import React from "react";
import "./SubstitutionModal.css";

const SubstitutionModal = ({ onCourt, bench, handleSub, closeModal }) => (
  <div className="modal-overlay">
    <div className="substitution-modal">
      <h3 className="modal-header">Substitution</h3>
      <div className="player-groups">
        <div className="player-group">
          <h4>On the Floor</h4>
          <div className="player-tiles">
            {onCourt.map((player) => (
              <button key={player.name} className="player-tile on-court" onClick={() => handleSub(player, "bench")}>
                {player.name}
              </button>
            ))}
          </div>
        </div>
        <div className="player-group">
          <h4>Bench</h4>
          <div className="player-tiles">
            {bench.map((player) => (
              <button key={player.name} className="player-tile bench" onClick={() => handleSub(player, "court")}>
                {player.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      <button className="close-modal-btn" onClick={closeModal}>
        Close
      </button>
    </div>
  </div>
);

export default SubstitutionModal;
