import React, { useState, useEffect } from "react";
import { supabase } from "./supabase";
import "./App.css";
import ConfirmationModal from "./ConfirmationModal";
import Tabs from "./Tabs";

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
  const days = Array.from({ length: 8 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().slice(0, 10); // 'YYYY-MM-DD'
  });

  const [selectedDate, setSelectedDate] = useState(days[0]);
  const [bookings, setBookings] = useState({});
  const [modalInfo, setModalInfo] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from("tee_times")
        .select("*")
        .eq("date", selectedDate);

      if (error) {
        console.error("Fetch error:", error);
      } else {
        const grouped = {};
        data.forEach(({ time, slot_index, name, holes, cart }) => {
          grouped[time] = grouped[time] || [null, null, null, null];
          grouped[time][slot_index] = { name, holes, cart };
        });
        setBookings(grouped);
      }
    }

    fetchData();
  }, [selectedDate]);

  const handleInput = (time, playerIndex, value) => {
    setModalInfo({ time, playerIndex, name: value });
  };

  const confirmBooking = async ({ time, playerIndex, name, holes, cart }) => {
    const updated = { ...bookings };
    updated[time] = updated[time] || [null, null, null, null];
    updated[time][playerIndex] = { name, holes, cart };
    setBookings(updated);

    const { error } = await supabase.from("tee_times").upsert({
      time,
      slot_index: playerIndex,
      name,
      holes,
      cart,
      date: selectedDate,
    });

    if (error) console.error("Save error:", error);
    setModalInfo(null);
  };

  return (
    <div className="App">
      <h1>CMW Tee Time Booking</h1>

      <Tabs days={days} selectedDate={selectedDate} onSelect={setSelectedDate} />

      <table>
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
                    value={bookings[time]?.[i]?.name || ""}
                    onChange={(e) => handleInput(time, i, e.target.value)}
                  />
                  {bookings[time]?.[i]?.holes && (
                    <div className="booking-details">
                      {bookings[time][i].holes} holes, {bookings[time][i].cart}
                    </div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {modalInfo && (
        <ConfirmationModal
          info={modalInfo}
          onConfirm={confirmBooking}
          onCancel={() => setModalInfo(null)}
        />
      )}
    </div>
  );
}

export default App;
