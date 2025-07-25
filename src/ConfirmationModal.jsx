import React, { useState } from "react";

function ConfirmationModal({ info, onConfirm, onCancel }) {
  const [holes, setHoles] = useState(18);
  const [cart, setCart] = useState("Walking");

  const handleSubmit = () => {
    onConfirm({
      ...info,
      holes,
      cart,
    });
  };

  return (
    <div className="modal">
      <h3>Confirm Booking for {info.name}</h3>
      <label>
        Holes:
        <select value={holes} onChange={(e) => setHoles(Number(e.target.value))}>
          <option value={9}>9</option>
          <option value={18}>18</option>
        </select>
      </label>
      <br />
      <label>
        Transport:
        <select value={cart} onChange={(e) => setCart(e.target.value)}>
          <option>Walking</option>
          <option>Cart</option>
        </select>
      </label>
      <br /><br />
      <button onClick={handleSubmit}>Confirm</button>
      <button onClick={onCancel} style={{ marginLeft: "10px" }}>Cancel</button>
    </div>
  );
}

export default ConfirmationModal;
