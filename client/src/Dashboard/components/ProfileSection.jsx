// src/Dashboard/components/ProfileSection.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import toast, { Toaster } from "react-hot-toast";
import { z} from 'zod'

const updProfile = z.object({
  name: z.string().min(3, "Username must be at least 3 characters").refine((val)=> /^[A-Z]/.test(val),{
    message:"First character must be uppercase"
  } ),
  email:z.email("Invalid email format"),
})

import { useLanguage } from '../pages/UseLanguage'; 

const ProfileSection = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    image: '',
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error , setError] = useState("");

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user._id;
  const API_BASE_URL = 'http://localhost:3000';

  const { t } = useLanguage();


  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        toast.error(t('userNotLoggedIn'));
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
        toast.error(t('failedToLoadProfile'));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, t]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      toast.error(t('userNotLoggedIn'));
      return;
    }

    const result = updProfile.safeParse({email:profile.email,name:profile.name})
    if(!result.success){
          const formattedErrors = result.error.format();
    
          setError({
    
            email:formattedErrors.email?._errors[0] || "",
            name: formattedErrors.name?._errors[0] || "",
          
           
          })
          return;
        }
    setError("")

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('name', profile.name);
    formData.append('email', profile.email);

    if (selectedFile) {
      formData.append('profilePic', selectedFile);
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

      const updatedUser = {
        ...user,
        name: res.data.name,
        email: res.data.email,
        image: res.data.image,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      window.dispatchEvent(new CustomEvent("profile-updated", {
        detail: updatedUser
      }));

      setSelectedFile(null);

      toast.success(t('savedSuccessfully'));
    } catch (err) {
      console.error('Profile update error:', err);
      toast.error(t('saveFailed'));
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-12">
        <p style={{ color: 'var(--text-muted)' }}>{t('loading')}</p>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 p-6 rounded-lg shadow-md"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)',
        maxWidth: '500px',
        margin: '0 auto'
      }}
    >
      <Toaster position="top-right" />

      <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--accent)' }}>
        {t('profile')}
      </h3>

      <div className="flex flex-col items-center space-y-4 mb-8">
        <div className="relative">
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover ring-4 ring-[var(--accent)]/20 shadow-lg"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center ring-4 ring-[var(--accent)]/20 shadow-lg">
              <span className="text-2xl font-bold text-gray-600">
                {profile.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
            {profile.name}
          </p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {profile.email}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
            {t('fullName')}
          </label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            className="w-full p-3 rounded-lg transition-all focus:ring-2 focus:ring-[var(--accent)]"
            style={{
              backgroundColor: 'var(--input-bg)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
            }}
            required
          />
           <p className="mb-4 text-xs" style={{ color: "red" }}>{error.name}</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
            {t('emailAddress')}
          </label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            className="w-full p-3 rounded-lg transition-all focus:ring-2 focus:ring-[var(--accent)]"
            style={{
              backgroundColor: 'var(--input-bg)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
            }}
            required
          />
           <p className="mb-4 text-xs" style={{ color: "red" }}>{error.email}</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
            {t('profilePicture')}
          </label>
          <input
            type="file"
            name="profilePic"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-3 rounded-lg transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--accent)] file:text-white hover:file:bg-[var(--accent)]/80"
            style={{
              backgroundColor: 'var(--input-bg)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
            }}
          />
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            {t('chooseProfilePicture')}
          </p>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 rounded-lg font-bold transition-all hover:scale-105 hover:shadow-lg"
          style={{
            backgroundColor: 'var(--accent)',
            color: 'white',
          }}
        >
          {t('updateProfile')}
        </button>
      </form>
    </motion.div>
  );
};

export default ProfileSection;