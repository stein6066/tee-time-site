import React, { useState, useEffect } from "react";
import { supabase } from "./supabase";
import "./App.css";
import ConfirmationModal from "./ConfirmationModal";
import Tabs from "./Tabs";
import LogoImage from "./3b214a8f-175b-4040-9329-9d0ead04f664.png";

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
    return d.toISOString().slice(0, 10);
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

  const handleTimeClick = (time) => {
    const existing = bookings[time];
    if (existing && existing.some(entry => entry && entry.name)) {
      alert("Tee Time Already Reserved, Please Call ProShop");
      return;
    }
    setModalInfo({ time });
  };

  const confirmBooking = async ({ time, players }) => {
    const updated = { ...bookings };
    updated[time] = [null, null, null, null];

    const rowsToUpsert = players.map((player, index) => {
      if (!player.name) return null;
      updated[time][index] = {
        name: player.name,
        holes: player.holes,
        cart: player.cart,
      };
      return {
        time,
        slot_index: index,
        name: player.name,
        holes: player.holes,
        cart: player.cart,
        date: selectedDate,
      };
    }).filter(Boolean);

    setBookings(updated);

    const { error } = await supabase
      .from("tee_times")
      .upsert(rowsToUpsert, {
        onConflict: ["date", "time", "slot_index"]
      });

    if (error) console.error("Save error:", error);
    setModalInfo(null);
  };

  return (
    <div className="App" style={{ fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f7f9fa', padding: '16px', maxWidth: '100%' }}>
      <img src={LogoImage} alt="SwingSlot Logo" style={{ width: '100%', maxWidth: '100%', height: 'auto', marginBottom: '16px' }} />

      <div style={{ marginBottom: '16px', overflowX: 'auto', whiteSpace: 'nowrap', display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>

        <Tabs days={days} selectedDate={selectedDate} onSelect={setSelectedDate} />
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{
  width: '100%',
  tableLayout: 'fixed',
  borderCollapse: 'collapse',
  background: '#ffffff',
  borderRadius: '10px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
}}>

          <thead>
            <tr style={{ backgroundColor: '#4CAF50', color: 'white', fontFamily: '"Segoe UI", sans-serif' }}>
              <th style={{
  width: '80px',
  padding: '12px',
  textAlign: 'left',
  borderTopLeftRadius: '10px',
  fontSize: '0.9rem',
  fontWeight: '600'
}}>
  Tee Time
</th>

              <th colSpan="4" style={{
  padding: '12px',
  textAlign: 'center',
  borderTopRightRadius: '10px',
  fontSize: '0.9rem',
  fontWeight: '600'
}}>
  Players
</th>

            </tr>
          </thead>
          <tbody>
            {teeTimes.map((time) => (
              <tr key={time} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>
                  <button
                    onClick={() => handleTimeClick(time)}
                    disabled={bookings[time]?.some(entry => entry && entry.name)}
                    className="time-button"
                    style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      background: bookings[time]?.some(entry => entry && entry.name) ? '#ccc' : '#2f855a',
                      color: 'white',
                      border: 'none',
                      cursor: bookings[time]?.some(entry => entry && entry.name) ? 'not-allowed' : 'pointer',
                      fontWeight: 'bold',
                      fontSize: '0.9rem'
                    }}
                  >
                    {time}
                  </button>
                </td>
                {[0, 1, 2, 3].map((i) => (
                  <td key={i} style={{ padding: '10px', textAlign: 'center', fontSize: '0.85rem' }}>
                    {bookings[time]?.[i]?.name ? (
                      <>
                        <strong>{bookings[time][i].name}</strong>
                        <div className="booking-details" style={{ fontSize: '0.8em', color: '#555' }}>
                          {bookings[time][i].holes} holes, {bookings[time][i].cart}
                        </div>
                      </>
                    ) : (
                      <span style={{ color: "#aaa" }}>—</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalInfo && (
        <ConfirmationModal
          info={modalInfo}
          onConfirm={confirmBooking}
          onCancel={() => setModalInfo(null)}
          isMobile={true}
        />
      )}
    </div>
  );
}

export default App;
