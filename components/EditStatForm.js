import React, { useState } from "react";

const EditStatForm = ({ entry, players, saveEdit, onCancel }) => {
  const [time, setTime] = useState(entry.time);
  const [period, setPeriod] = useState(entry.period);
  const [player, setPlayer] = useState(entry.player);
  const [stat, setStat] = useState(entry.stat);

  const handleSave = () => {
    saveEdit({ ...entry, time, period, player, stat });
  };

  return (
    <div>
      <h3>Edit Stat</h3>
      <div>
        <label>Time: </label>
        <input value={time} onChange={(e) => setTime(e.target.value)} />
      </div>
      <div>
        <label>Period: </label>
        <input value={period} type="number" onChange={(e) => setPeriod(e.target.value)} />
      </div>
      <div>
        <label>Player: </label>
        <select value={player} onChange={(e) => setPlayer(e.target.value)}>
          {players.map((p) => (
            <option key={p.name} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Stat: </label>
        <input value={stat} onChange={(e) => setStat(e.target.value)} />
      </div>
      <button onClick={handleSave}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default EditStatForm;
