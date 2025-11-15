// src/Dashboard/components/ProfileSection.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import toast, { Toaster } from "react-hot-toast";

const ProfileSection = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    image: '',
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user._id;
  const API_BASE_URL = 'http://localhost:3000';

  // ---------------------------
  // Fetch Profile on Page Load
  // ---------------------------
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        toast.error('User not logged in');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_BASE_URL}/profile?userId=${userId}`);
        setProfile(res.data);
        setPreview(
          res.data.image ? `${API_BASE_URL}/uploads/${res.data.image}` : null
        );
      } catch (err) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  // ---------------------------
  // Handle Input Change
  // ---------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // ---------------------------
  // Handle Image Preview
  // ---------------------------
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // ---------------------------
  // Submit Form (Save Profile)
  // ---------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      toast.error('User not logged in');
      return;
    }

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('name', profile.name);
    formData.append('email', profile.email);

    const file = e.target.profilePic.files[0];
    if (file) {
      formData.append('profilePic', file);
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/profile`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setProfile(res.data);

      const newImageURL = res.data.image
        ? `${API_BASE_URL}/uploads/${res.data.image}`
        : null;

      setPreview(newImageURL);

      // ---------------------------
      // Update localStorage (Navbar Refresh Fix)
      // ---------------------------
      const updatedUser = {
        ...user,
        name: res.data.name,
        profilePic: res.data.image,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      // 🔥 IMPORTANT: Trigger event so NAVBAR updates without refresh
      window.dispatchEvent(new Event("profile-updated"));

      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  if (loading)
    return <p className="text-var(--text-muted)">Loading profile...</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 p-6 rounded-lg shadow-md"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)',
      }}
    >
      <Toaster position="top-right" />

      <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--accent)' }}>
        User Profile
      </h3>

      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 mb-6">
        <img
          src={preview || ''}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover ring-2 ring-[var(--accent)]/20"
        />

        <div>
          <p className="text-lg font-medium">{profile.name}</p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {profile.email}
          </p>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-var(--text-secondary) mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            className="w-full p-2 rounded-md"
            style={{
              backgroundColor: 'var(--input-bg)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
            }}
          />
        </div>

        <div>
          <label className="block text-var(--text-secondary) mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            className="w-full p-2 rounded-md"
            style={{
              backgroundColor: 'var(--input-bg)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
            }}
          />
        </div>

        <div>
          <label className="block text-var(--text-secondary) mb-1">
            Profile Picture
          </label>
          <input
            type="file"
            name="profilePic"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[var(--accent)] file:text-var(--bg-primary) hover:file:bg-[var(--accent)]/80"
            style={{
              backgroundColor: 'var(--input-bg)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
            }}
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 rounded-md font-bold"
          style={{
            backgroundColor: 'var(--accent)',
            color: 'var(--bg-primary)',
          }}
        >
          Update Profile
        </button>
      </form>
    </motion.div>
  );
};

export default ProfileSection;
