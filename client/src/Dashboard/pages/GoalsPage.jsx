// src/Dashboard/pages/GoalsPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import GoalsSection from '../components/GoalsSection';

const GoalsPage = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-8"
  >
    <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--accent)' }}>Goals</h2>
    <p style={{ color: 'var(--text-muted)' }}>Set and track fitness goals.</p>
    <GoalsSection />
  </motion.div>
);

export default GoalsPage;