import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SwapRequests() {
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/swaps/received", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(res.data);
    } catch (e) {
      alert("Error fetching swap requests");
    }
  };

  const handleDecision = async (id, action) => {
    try {
      await axios.patch(`http://localhost:5000/api/swaps/${id}/${action}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchRequests();
    } catch (e) {
      alert("Error updating swap");
    }
  };

  return (
    <div style={{ maxWidth:650, margin:'40px auto', background:'#fff', borderRadius:12, padding:25 }}>
      <h2 style={{color:'#4261ee',textAlign:'center'}}>Swap Requests</h2>
      {requests.length === 0 ? <p>No swap requests.</p> : (
        <ul>
          {requests.map((r) => (
            <li key={r._id} style={{ marginBottom: 22, background:'#f0f4fc',padding:12,borderRadius:8 }}>
              <strong>{r.requester.name}</strong> requested: <strong>{r.book.title}</strong> <br/>
              Status: <span style={{ color: r.status==='accepted' ? '#198754' : r.status==='rejected' ? '#e63946' : '#f4a261',fontWeight:600 }}>{r.status}</span>
              {r.status === 'pending' && (
                <span style={{ marginLeft:16 }}>
                  <button style={{ marginRight:10,background:'#198754',color:'#fff',border:'none',borderRadius:6,padding:'4px 10px',cursor:'pointer'}} onClick={() => handleDecision(r._id, 'accept')}>Accept</button>
                  <button style={{ background:'#e63946',color:'#fff',border:'none',borderRadius:6,padding:'4px 10px',cursor:'pointer'}} onClick={() => handleDecision(r._id, 'reject')}>Reject</button>
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
