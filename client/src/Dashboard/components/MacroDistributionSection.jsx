// src/Dashboard/components/MacroDistributionSection.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const MacroDistributionSection = () => {
  const [macroData, setMacroData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMacros = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/macros', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMacroData(res.data);
      } catch (err) {
        setError('Failed to load macro distribution');
      } finally {
        setLoading(false);
      }
    };
    fetchMacros();
  }, []);

  if (loading) return <p className="text-var(--text-muted)">Loading macro distribution...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 p-4 rounded-lg shadow-md"
      style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
    >
      <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--accent)' }}>Macro Distribution</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-var(--border)">
          <thead style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Proteins (g)</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Carbs (g)</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Fats (g)</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Total Calories</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-var(--border)">
            {macroData.map((data) => (
              <tr key={data._id} className="hover:bg-var(--bg-card-hover)">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{new Date(data.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{data.proteins}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{data.carbs}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{data.fats}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{data.calories}</td>
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

export default MacroDistributionSection;