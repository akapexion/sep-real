// src/Dashboard/pages/NutritionPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import NutritionLogsSection from '../components/NutritionLogsSection';

const NutritionPage = () => (
  <motion.main
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="p-4 sm:p-6 lg:p-8 min-h-screen"
  >
    <div className="max-w-7xl mx-auto">
      <NutritionLogsSection />
    </div>
  </motion.main>
);

export default NutritionPage;