import React, { useState } from "react";
import "./ConfirmationModal.css";

function ConfirmationModal({ info, onConfirm, onCancel }) {
  const [players, setPlayers] = useState([
    { name: "", holes: 18, cart: "Walking" },
    { name: "", holes: 18, cart: "Walking" },
    { name: "", holes: 18, cart: "Walking" },
    { name: "", holes: 18, cart: "Walking" }
  ]);

  const handleChange = (index, field, value) => {
    const updated = [...players];
    updated[index][field] = value;
    setPlayers(updated);
  };

  const handleSubmit = () => {
    onConfirm({ time: info.time, players });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Reserve Tee Time – {info.time}</h2>

        {players.map((player, i) => (
          <div key={i} className="player-section">
            <label>Player {i + 1} Name</label>
            <input
              type="text"
              value={player.name}
              onChange={(e) => handleChange(i, "name", e.target.value)}
              placeholder={`Player ${i + 1}`}
            />
            <div className="select-row">
              <div>
                <label>Holes</label>
                <select
                  value={player.holes}
                  onChange={(e) => handleChange(i, "holes", parseInt(e.target.value))}
                >
                  <option value={9}>9</option>
                  <option value={18}>18</option>
                </select>
              </div>
              <div>
                <label>Transport</label>
                <select
                  value={player.cart}
                  onChange={(e) => handleChange(i, "cart", e.target.value)}
                >
                  <option value="Walking">Walking</option>
                  <option value="Cart">Cart</option>
                </select>
              </div>
            </div>
          </div>
        ))}

        <div className="modal-buttons">
          <button className="confirm-btn" onClick={handleSubmit}>Confirm</button>
          <button className="cancel-btn" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
