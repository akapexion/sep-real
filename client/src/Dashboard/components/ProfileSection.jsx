// src/Dashboard/components/ProfileSection.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { z } from 'zod';
import { User, Mail, Weight, Camera, Save, Loader2 } from 'lucide-react';
import { useLanguage } from '../pages/UseLanguage';

const updProfile = z.object({
  name: z.string().min(3, "Username must be at least 3 characters")
    .refine((val) => /^[A-Z]/.test(val), { message: "First character must be uppercase" }),
  email: z.email("Invalid email format"),
});

// ── Glassmorphism shared styles ──────────────────────────────────────────────
const glassCard = {
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255,255,255,0.10)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.08)",
};

const glassInput = {
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "var(--text-primary)",
  borderRadius: "10px",
  transition: "all 0.2s ease",
};

const inputFocusStyle = `
  .glass-input:focus {
    outline: none;
    border-color: var(--accent) !important;
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 20%, transparent),
                inset 0 1px 0 rgba(255,255,255,0.1) !important;
    background: rgba(255,255,255,0.08) !important;
  }
  .glass-input::placeholder { color: rgba(255,255,255,0.3); }

  .glass-file::file-selector-button {
    background: color-mix(in srgb, var(--accent) 80%, #000);
    color: white;
    border: none;
    padding: 6px 14px;
    border-radius: 7px;
    font-size: 0.75rem;
    font-weight: 600;
    margin-right: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .glass-file::file-selector-button:hover {
    background: var(--accent);
    box-shadow: 0 0 10px color-mix(in srgb, var(--accent) 40%, transparent);
  }

  @keyframes glow-pulse {
    0%, 100% { box-shadow: 0 0 8px color-mix(in srgb, var(--accent) 40%, transparent); }
    50%       { box-shadow: 0 0 18px color-mix(in srgb, var(--accent) 70%, transparent); }
  }

  @keyframes avatar-ring-pulse {
    0%, 100% { box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 30%, transparent),
                            0 0 20px color-mix(in srgb, var(--accent) 15%, transparent); }
    50%       { box-shadow: 0 0 0 5px color-mix(in srgb, var(--accent) 50%, transparent),
                            0 0 32px color-mix(in srgb, var(--accent) 25%, transparent); }
  }
`;
// ─────────────────────────────────────────────────────────────────────────────

const ProfileSection = () => {
  const [profile, setProfile] = useState({ name: '', email: '', image: '', currentWeight: '' });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState({});

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user._id;
  const API_BASE_URL = 'http://localhost:3000';
  const { t } = useLanguage();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) { toast.error(t('userNotLoggedIn')); setLoading(false); return; }
      try {
        const res = await axios.get(`${API_BASE_URL}/profile?userId=${userId}`);
        setProfile({ ...res.data, currentWeight: user.currentWeight || '' });
        setPreview(res.data.image ? `${API_BASE_URL}/uploads/${res.data.image}` : null);
      } catch { toast.error(t('failedToLoadProfile')); }
      finally { setLoading(false); }
    };
    fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) { setSelectedFile(file); setPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) { toast.error(t('userNotLoggedIn')); return; }

    const result = updProfile.safeParse({ email: profile.email, name: profile.name });
    if (!result.success) {
      const fe = result.error.format();
      setError({ email: fe.email?._errors[0] || "", name: fe.name?._errors[0] || "" });
      return;
    }
    setError({});

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('name', profile.name);
    formData.append('email', profile.email);
    if (selectedFile) formData.append('profilePic', selectedFile);

    setSaving(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/profile`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (profile.currentWeight) {
        await axios.post(`${API_BASE_URL}/profile/weight`, {
          userId, currentWeight: Number(profile.currentWeight),
        });
      }

      setProfile({ ...res.data, currentWeight: profile.currentWeight });
      const newImageURL = res.data.image ? `${API_BASE_URL}/uploads/${res.data.image}` : null;
      setPreview(newImageURL);

      const updatedUser = {
        ...user, name: res.data.name, email: res.data.email, image: res.data.image,
        currentWeight: profile.currentWeight ? Number(profile.currentWeight) : user.currentWeight,
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      window.dispatchEvent(new CustomEvent('profile-updated', { detail: updatedUser }));
      setSelectedFile(null);
      toast.success(t('savedSuccessfully'));
    } catch (err) {
      console.error(err);
      toast.error(t('saveFailed'));
    } finally { setSaving(false); }
  };

  // ── Loading state ──
  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div style={{ position: "relative" }}>
        <Loader2 className="w-10 h-10 animate-spin" style={{ color: "var(--accent)" }} />
        <div style={{
          position: "absolute", inset: "-6px", borderRadius: "50%",
          background: "radial-gradient(circle, color-mix(in srgb, var(--accent) 20%, transparent), transparent 70%)",
          animation: "glow-pulse 2s ease-in-out infinite",
        }} />
      </div>
    </div>
  );

  return (
    <>
      <style>{inputFocusStyle}</style>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mt-6 rounded-2xl overflow-hidden"
        style={{ ...glassCard, padding: "1.75rem", maxWidth: "520px", margin: "1.5rem auto 0" }}
      >
        <Toaster toastOptions={{
          style: { ...glassCard, color: "var(--text-primary)", fontSize: "0.875rem" },
        }} />

        {/* ── Header ── */}
        <div className="flex items-center gap-3 mb-6">
          <div style={{
            padding: "10px", borderRadius: "12px",
            background: "color-mix(in srgb, var(--accent) 15%, transparent)",
            border: "1px solid color-mix(in srgb, var(--accent) 30%, transparent)",
            boxShadow: "0 0 16px color-mix(in srgb, var(--accent) 20%, transparent)",
            animation: "glow-pulse 3s ease-in-out infinite",
          }}>
            <User className="w-5 h-5" style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
              {t('profile')}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              {t('manageYourAccountDetails') || "Manage your account details"}
            </p>
          </div>
        </div>

        {/* ── Avatar Block ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-3 py-6 mb-4 rounded-xl"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Avatar */}
          <div style={{ position: "relative" }}>
            {preview ? (
              <img
                src={preview}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
                style={{ animation: "avatar-ring-pulse 3s ease-in-out infinite" }}
              />
            ) : (
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{
                  background: "color-mix(in srgb, var(--accent) 15%, rgba(255,255,255,0.05))",
                  border: "2px solid color-mix(in srgb, var(--accent) 40%, transparent)",
                  animation: "avatar-ring-pulse 3s ease-in-out infinite",
                }}
              >
                <span className="text-3xl font-bold" style={{ color: "var(--accent)" }}>
                  {profile.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
            )}

            {/* Camera badge */}
            <div style={{
              position: "absolute", bottom: 2, right: 2,
              padding: "5px", borderRadius: "50%",
              background: "var(--accent)",
              boxShadow: "0 0 10px color-mix(in srgb, var(--accent) 50%, transparent)",
              border: "2px solid rgba(0,0,0,0.3)",
            }}>
              <Camera className="w-3 h-3 text-white" />
            </div>
          </div>

          {/* Name + email display */}
          <div className="text-center">
            <p className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
              {profile.name || "—"}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              {profile.email || "—"}
            </p>
          </div>

          {/* Current weight pill */}
          {profile.currentWeight && (
            <span
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{
                background: "color-mix(in srgb, var(--accent) 12%, transparent)",
                color: "var(--accent)",
                border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)",
              }}
            >
              ⚖️ {profile.currentWeight} kg
            </span>
          )}
        </motion.div>

        {/* ── Form ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="rounded-xl p-5"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: "var(--accent)", letterSpacing: "0.12em" }}>
            ✏️ {t('updateProfile') || "Update Profile"}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>

            {/* Full Name */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium uppercase tracking-wider pl-1 flex items-center gap-1.5"
                style={{ color: "var(--text-muted)" }}>
                <User className="w-3 h-3" /> {t('fullName')} *
              </label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="glass-input w-full px-3 py-2.5 text-sm"
                style={glassInput}
              />
              {error.name && (
                <p className="text-xs pl-1" style={{ color: "#f87171" }}>{error.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium uppercase tracking-wider pl-1 flex items-center gap-1.5"
                style={{ color: "var(--text-muted)" }}>
                <Mail className="w-3 h-3" /> {t('emailAddress')} *
              </label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="glass-input w-full px-3 py-2.5 text-sm"
                style={glassInput}
              />
              {error.email && (
                <p className="text-xs pl-1" style={{ color: "#f87171" }}>{error.email}</p>
              )}
            </div>

            {/* Current Weight */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium uppercase tracking-wider pl-1 flex items-center gap-1.5"
                style={{ color: "var(--text-muted)" }}>
                <Weight className="w-3 h-3" /> Current Weight (kg)
              </label>
              <input
                type="number"
                name="currentWeight"
                value={profile.currentWeight}
                onChange={handleChange}
                placeholder="e.g. 72"
                className="glass-input w-full px-3 py-2.5 text-sm"
                style={glassInput}
              />
            </div>

            {/* Profile Picture */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium uppercase tracking-wider pl-1 flex items-center gap-1.5"
                style={{ color: "var(--text-muted)" }}>
                <Camera className="w-3 h-3" /> {t('profilePicture')}
              </label>
              <input
                type="file"
                name="profilePic"
                accept="image/*"
                onChange={handleFileChange}
                className="glass-input glass-file w-full px-3 py-2 text-sm"
                style={{ ...glassInput, color: "var(--text-muted)" }}
              />
              <p className="text-xs pl-1" style={{ color: "var(--text-muted)" }}>
                {t('chooseProfilePicture') || "JPG, PNG or WebP — max 5 MB"}
              </p>
            </div>

            {/* Submit */}
            <div className="pt-1">
              <motion.button
                type="submit"
                disabled={saving}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{
                  background: "linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 70%, #000))",
                  boxShadow: "0 4px 16px color-mix(in srgb, var(--accent) 35%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--accent) 50%, transparent)",
                  opacity: saving ? 0.7 : 1,
                  cursor: saving ? "not-allowed" : "pointer",
                }}
              >
                {saving
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Save className="w-4 h-4" />}
                {saving ? `${t('saving') || "Saving"}…` : t('updateProfile')}
              </motion.button>
            </div>

          </form>
        </motion.div>
      </motion.div>
    </>
  );
};

export default ProfileSection;