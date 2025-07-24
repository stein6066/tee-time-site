import { supabase } from './supabase';
import React, { useState, useEffect } from "react";
import "./App.css";




function generateTeeTimes(start = 8, end = 20, interval = 8) {
  const times = [];
  let minutes = start * 60;
  const endMinutes = end * 60;

  while (minutes <= endMinutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const label = `${hours % 12 || 12}:${mins.toString().padStart(2, "0")} ${hours < 12 ? "AM" : "PM"}`;
    times.push(label);
    minutes += interval;
  }
  return times;
}

function App() {
  const teeTimes = generateTeeTimes();
  const [bookings, setBookings] = useState({});

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from('tee_times').select('*');
      if (error) {
        console.error('Fetch error:', error);
      } else {
        const grouped = {};
        data.forEach(({ time, slot_index, name }) => {
          grouped[time] = grouped[time] || ["", "", "", ""];
          grouped[time][slot_index] = name;
        });
        setBookings(grouped);
      }
    }
    fetchData();
  }, []);
  

  const handleChange = async (time, playerIndex, value) => {
    const updated = { ...bookings };
    updated[time] = updated[time] || ["", "", "", ""];
    updated[time][playerIndex] = value;
    setBookings(updated);
  
    // Upsert (insert or update)
    const { error } = await supabase
      .from('tee_times')
      .upsert({ time, slot_index: playerIndex, name: value });
    if (error) console.error('Save error:', error);
  };
  

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>CMW Tee Time Booking Demo</h1>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Tee Time</th>
            <th colSpan="4">Players</th>
          </tr>
        </thead>
        <tbody>
          {teeTimes.map((time) => (
            <tr key={time}>
              <td>{time}</td>
              {[0, 1, 2, 3].map((i) => (
                <td key={i}>
                  <input
                    type="text"
                    placeholder={`Player ${i + 1}`}
                    value={bookings[time]?.[i] || ""}
                    onChange={(e) => handleChange(time, i, e.target.value)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
