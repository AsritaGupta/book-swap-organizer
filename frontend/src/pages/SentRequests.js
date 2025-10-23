import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SentRequests() {
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get("https://book-swap-organizer.onrender.com/api/swaps/sent", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(res.data);
    } catch (e) {
      alert("Error fetching sent requests");
    }
  };

  return (
    <div style={{ maxWidth:650, margin:'40px auto', background:'#fff', borderRadius:12, padding:25 }}>
      <h2 style={{color:'#4261ee',textAlign:'center'}}>Sent Swap Requests</h2>
      {requests.length === 0 ? <p>No sent swap requests.</p> : (
        <ul>
          {requests.map((r) => (
            <li key={r._id} style={{ marginBottom: 22, background:'#f0f4fc',padding:12,borderRadius:8 }}>
              Request for: <strong>{r.book.title}</strong>
              <br/>Status: <span style={{ color: r.status==='accepted' ? '#198754' : r.status==='rejected' ? '#e63946' : '#f4a261',fontWeight:600 }}>{r.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
