// src/Dashboard/components/WorkoutFrequencySection.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const WorkoutFrequencySection = () => {
  const [frequencyData, setFrequencyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFrequency = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFrequencyData(res.data);
      } catch (err) {
        setError('Failed to load workout frequency');
      } finally {
        setLoading(false);
      }
    };
    fetchFrequency();
  }, []);

  if (loading) return <p className="text-var(--text-muted)">Loading workout frequency...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 p-4 rounded-lg shadow-md"
      style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
    >
      <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--accent)' }}>Workout Frequency</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-var(--border)">
          <thead style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Week</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Frequency</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Total Duration (min)</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-var(--border)">
            {frequencyData.map((data) => (
              <tr key={data._id} className="hover:bg-var(--bg-card-hover)">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{data.week}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{data.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{data.frequency}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{data.duration}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button className="text-var(--accent) hover:underline mr-2">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default WorkoutFrequencySection;