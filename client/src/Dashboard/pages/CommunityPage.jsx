import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, UserPlus, UserMinus, Loader2, SlidersHorizontal } from 'lucide-react';

const API_BASE_URL = 'http://localhost:3000';

// ── Glassmorphism shared styles (mirrors RemindersSection) ───────────────────
const glassCard = {
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.10)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.08)',
};

const glassInput = {
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  border: '1px solid rgba(255,255,255,0.12)',
  color: 'var(--text-primary)',
  borderRadius: '10px',
  transition: 'all 0.2s ease',
};

const injectStyles = `
  @keyframes glow-pulse {
    0%, 100% { box-shadow: 0 0 8px color-mix(in srgb, var(--accent) 40%, transparent); }
    50%       { box-shadow: 0 0 18px color-mix(in srgb, var(--accent) 70%, transparent); }
  }
  .glass-input:focus {
    outline: none;
    border-color: var(--accent) !important;
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 20%, transparent),
                inset 0 1px 0 rgba(255,255,255,0.1) !important;
    background: rgba(255,255,255,0.08) !important;
  }
  .glass-input::placeholder { color: rgba(255,255,255,0.3); }
  .glass-input option { background: var(--bg-card); color: var(--text-primary); }

  .user-card:hover .card-glow {
    opacity: 1;
  }
`;
// ─────────────────────────────────────────────────────────────────────────────

const CommunityPage = () => {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [role, setRole]       = useState('all');
  const [sortBy, setSortBy]   = useState('newest');

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userId      = currentUser._id;

  useEffect(() => {
    const timer = setTimeout(() => fetchUsers(), 300);
    return () => clearTimeout(timer);
  }, [search, role, sortBy]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/users`, {
        params: { userId, search, role, sortBy },
      });
      setUsers(res.data);
    } catch {
      toast.error('Failed to load community');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (targetId) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/users/${targetId}/follow`, { userId });
      toast.success(res.data.message);
      fetchUsers();
    } catch {
      toast.error('Failed to update follow status');
    }
  };

  return (
    <>
      <style>{injectStyles}</style>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mt-6 rounded-2xl overflow-hidden"
        style={{ ...glassCard, padding: '1.75rem' }}
      >
        <Toaster toastOptions={{
          style: { ...glassCard, color: 'var(--text-primary)', fontSize: '0.875rem' },
        }} />

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div style={{
              padding: '10px', borderRadius: '12px',
              background: 'color-mix(in srgb, var(--accent) 15%, transparent)',
              border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)',
              boxShadow: '0 0 16px color-mix(in srgb, var(--accent) 20%, transparent)',
              animation: 'glow-pulse 3s ease-in-out infinite',
            }}>
              <Users className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Community
              </h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                Discover fitness enthusiasts and track their progress
              </p>
            </div>
          </div>

          {/* Member count pill */}
          {!loading && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{
              background: 'color-mix(in srgb, var(--accent) 10%, transparent)',
              border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)',
            }}>
              <span className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>
                {users.length} member{users.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        {/* ── Filters ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-3 items-center"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {/* Section label */}
          <div className="flex items-center gap-2 mr-2 flex-shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
            <span className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'var(--accent)', letterSpacing: '0.12em' }}>
              Filter
            </span>
          </div>

          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search users by name…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="glass-input w-full pl-9 pr-4 py-2.5 text-sm"
              style={glassInput}
            />
          </div>

          {/* Role select */}
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            className="glass-input px-3 py-2.5 text-sm"
            style={{ ...glassInput, minWidth: '130px' }}
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          {/* Sort select */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="glass-input px-3 py-2.5 text-sm"
            style={{ ...glassInput, minWidth: '160px' }}
          >
            <option value="newest">Newest First</option>
            <option value="followers">Most Followers</option>
          </select>
        </motion.div>

        {/* ── Loading ── */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div style={{ position: 'relative' }}>
              <Loader2 className="w-10 h-10 animate-spin" style={{ color: 'var(--accent)' }} />
              <div style={{
                position: 'absolute', inset: '-6px', borderRadius: '50%',
                background: 'radial-gradient(circle, color-mix(in srgb, var(--accent) 20%, transparent), transparent 70%)',
                animation: 'glow-pulse 2s ease-in-out infinite',
              }} />
            </div>
          </div>

        ) : users.length === 0 ? (
          /* ── Empty state ── */
          <div className="flex flex-col items-center gap-3 py-16">
            <div style={{
              padding: 16, borderRadius: '50%',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <Users className="w-6 h-6" style={{ color: 'var(--text-muted)' }} />
            </div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              No users found matching your criteria.
            </p>
          </div>

        ) : (
          /* ── User cards grid ── */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <AnimatePresence>
              {users.map((u, i) => {
                const isFollowing = u.followers?.includes(userId);
                return (
                  <motion.div
                    key={u._id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="user-card relative flex flex-col items-center text-center rounded-xl p-5 overflow-hidden"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.09)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                    }}
                  >
                    {/* Subtle hover glow behind card */}
                    <div className="card-glow" style={{
                      position: 'absolute', inset: 0, borderRadius: '12px', pointerEvents: 'none',
                      background: 'radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--accent) 8%, transparent), transparent 70%)',
                      opacity: 0, transition: 'opacity 0.3s ease',
                    }} />

                    {/* Avatar */}
                    <div className="relative mb-4">
                      <div className="w-18 h-18 rounded-full overflow-hidden flex items-center justify-center"
                        style={{
                          width: 72, height: 72,
                          background: 'linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 55%, #000))',
                          boxShadow: '0 0 0 3px rgba(255,255,255,0.08), 0 0 16px color-mix(in srgb, var(--accent) 25%, transparent)',
                        }}>
                        {u.image
                          ? <img src={`${API_BASE_URL}/uploads/${u.image}`} alt={u.name}
                              className="object-cover w-full h-full" />
                          : <span className="text-2xl font-bold text-white">
                              {u.name?.[0]?.toUpperCase() || '?'}
                            </span>
                        }
                      </div>
                      {/* Online-style dot */}
                      <span style={{
                        position: 'absolute', bottom: 2, right: 2,
                        width: 11, height: 11, borderRadius: '50%',
                        background: isFollowing ? 'var(--accent)' : '#6b7280',
                        border: '2px solid rgba(0,0,0,0.4)',
                        boxShadow: isFollowing ? '0 0 6px color-mix(in srgb, var(--accent) 60%, transparent)' : 'none',
                      }} />
                    </div>

                    {/* Name */}
                    <h3 className="font-semibold text-base mb-1 truncate w-full"
                      style={{ color: 'var(--text-primary)' }}>
                      {u.name}
                    </h3>

                    {/* Role badge */}
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium mb-1 capitalize"
                      style={u.role === 'admin' ? {
                        background: 'rgba(168,85,247,0.12)',
                        color: '#c084fc',
                        border: '1px solid rgba(168,85,247,0.25)',
                      } : {
                        background: 'color-mix(in srgb, var(--accent) 12%, transparent)',
                        color: 'var(--accent)',
                        border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)',
                      }}>
                      {u.role || 'user'}
                    </span>

                    {/* Follower count */}
                    <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
                      {u.followers?.length || 0} follower{u.followers?.length !== 1 ? 's' : ''}
                    </p>

                    {/* Follow / Unfollow button */}
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleFollow(u._id)}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-all"
                      style={isFollowing ? {
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        color: 'var(--text-muted)',
                      } : {
                        background: 'linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 70%, #000))',
                        border: '1px solid color-mix(in srgb, var(--accent) 50%, transparent)',
                        boxShadow: '0 4px 12px color-mix(in srgb, var(--accent) 30%, transparent)',
                        color: '#fff',
                      }}
                    >
                      {isFollowing
                        ? <><UserMinus className="w-3.5 h-3.5" /> Unfollow</>
                        : <><UserPlus  className="w-3.5 h-3.5" /> Follow</>
                      }
                    </motion.button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default CommunityPage;