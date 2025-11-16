// src/Dashboard/pages/SettingsPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import SettingSection from '../components/SettingSection';

const SettingsPage = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="min-h-screen p-6"
    style={{ backgroundColor: 'var(--bg-primary)' }}
  >
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--accent)' }}>
          Settings
        </h1>
        <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
          Customize your FitTrack experience and preferences
        </p>
      </div>

      {/* Main Settings Content - Full width without sidebar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <SettingSection />
      </motion.div>

      {/* Quick Stats/Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="p-6 rounded-lg border text-center transition-all duration-200 hover:shadow-lg hover:scale-105"
          style={{ 
            backgroundColor: 'var(--bg-card)', 
            borderColor: 'var(--border)'
          }}
        >
          <div className="text-3xl font-bold mb-2" style={{ color: 'var(--accent)' }}>
            {new Date().getFullYear()}
          </div>
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Account Created
          </div>
        </div>
        
        <div className="p-6 rounded-lg border text-center transition-all duration-200 hover:shadow-lg hover:scale-105"
          style={{ 
            backgroundColor: 'var(--bg-card)', 
            borderColor: 'var(--border)'
          }}
        >
          <div className="text-3xl font-bold mb-2" style={{ color: 'var(--accent)' }}>
            24/7
          </div>
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Support Available
          </div>
        </div>
        
        <div className="p-6 rounded-lg border text-center transition-all duration-200 hover:shadow-lg hover:scale-105"
          style={{ 
            backgroundColor: 'var(--bg-card)', 
            borderColor: 'var(--border)'
          }}
        >
          <div className="text-3xl font-bold mb-2" style={{ color: 'var(--accent)' }}>
            v2.1.0
          </div>
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
            App Version
          </div>
        </div>
      </motion.div>
    </div>
  </motion.div>
);

export default SettingsPage;