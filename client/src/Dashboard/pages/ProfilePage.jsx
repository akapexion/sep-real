import React from 'react';
import { motion } from 'framer-motion';
import ProfileSection from '../components/ProfileSection';

const ProfilePage = ({user}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-8"
  >
    <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--accent)' }}>Profile</h2>
    <p style={{ color: 'var(--text-muted)' }}>View and update your personal information.</p>
    <ProfileSection user={user} />
  </motion.div>
);

export default ProfilePage;