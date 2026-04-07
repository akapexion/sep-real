import React, { useEffect, useState } from 'react'
import axios from 'axios'

const API_BASE = "http://localhost:3000";

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedbacks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE}/feedback`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFeedbacks(res.data.feedback);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  if (loading) return <p style={{ color: 'var(--text-muted)' }}>Loading feedbacks...</p>;

  return (
    <div className="mt-6 p-6 rounded-lg shadow-md"
      style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>

      <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--accent)' }}>
        User Feedbacks
      </h3>

      {feedbacks.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No feedbacks yet.</p>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((fb) => (
            <div key={fb._id} className="p-4 rounded-lg"
              style={{ backgroundColor: 'var(--bg-card-hover)', border: '1px solid var(--border)' }}>

              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{fb.name}</p>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{fb.email}</p>
                </div>
                <span className="px-2 py-1 rounded text-xs font-bold"
                  style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
                  ⭐ {fb.rating}/5
                </span>
              </div>

              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{fb.message}</p>

              <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                {new Date(fb.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Feedbacks