import React from "react";

function Tabs({ days, selectedDate, onSelect }) {
  return (
    <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
      {days.map((date) => (
        <button
          key={date}
          onClick={() => onSelect(date)}
          style={{
            padding: "10px 15px",
            borderRadius: "8px",
            background: date === selectedDate ? "#4CAF50" : "#e2e8f0",
            color: date === selectedDate ? "white" : "#333",
            border: "none",
            fontWeight: "bold",
          }}
        >
          {new Date(date).toLocaleDateString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </button>
      ))}
    </div>
  );
}

export default Tabs;
