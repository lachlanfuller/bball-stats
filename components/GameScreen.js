import React, { useState } from "react";
import PlayerList from "./PlayerList";
import StatsLog from "./StatsLog";

const GameScreen = ({ players, onCourt, setOnCourt, gameSetup, setScreen }) => {
  const [statsLog, setStatsLog] = useState([]);

  const endGame = () => {
    setScreen("setup");
  };

  return (
    <div>
      <h2>Game Screen</h2>
      <PlayerList players={players} onCourt={onCourt} setOnCourt={setOnCourt} />
      <StatsLog statsLog={statsLog} setStatsLog={setStatsLog} />
      <button onClick={endGame}>End Game</button>
    </div>
  );
};

export default GameScreen;
