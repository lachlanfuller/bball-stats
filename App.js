import React, { useState, useEffect } from "react";
import GameSetup from "./components/GameSetup";
import GameScreen from "./components/GameScreen";
import { getFromLocalStorage, saveToLocalStorage } from "./utils/localStorageUtils";

const App = () => {
  const [screen, setScreen] = useState("setup");
  const [players, setPlayers] = useState(() => getFromLocalStorage("players", []));
  const [onCourt, setOnCourt] = useState(() => getFromLocalStorage("onCourt", []));
  const [gameSetup, setGameSetup] = useState(() => getFromLocalStorage("gameSetup", { periods: 4, periodTime: 10 }));

  const saveData = () => {
    saveToLocalStorage("players", players);
    saveToLocalStorage("onCourt", onCourt);
    saveToLocalStorage("gameSetup", gameSetup);
  };

  useEffect(() => {
    saveData();
  }, [players, onCourt, gameSetup]);

  return (
    <div className="App">
      {screen === "setup" && (
        <GameSetup
          players={players}
          setPlayers={setPlayers}
          setScreen={setScreen}
          gameSetup={gameSetup}
          setGameSetup={setGameSetup}
        />
      )}
      {screen === "game" && (
        <GameScreen players={players} onCourt={onCourt} setOnCourt={setOnCourt} gameSetup={gameSetup} setScreen={setScreen} />
      )}
    </div>
  );
};

export default App;
