import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Search, MonitorOff, MonitorCheck, Users, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  borderRadius: '999px',
  transition: 'all 0.2s ease',
};

const injectStyles = `
  @keyframes glow-pulse {
    0%, 100% { box-shadow: 0 0 8px color-mix(in srgb, var(--accent) 40%, transparent); }
    50%       { box-shadow: 0 0 18px color-mix(in srgb, var(--accent) 70%, transparent); }
  }
  .search-input:focus {
    outline: none;
    border-color: var(--accent) !important;
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 20%, transparent) !important;
    background: rgba(255,255,255,0.08) !important;
  }
  .search-input::placeholder { color: rgba(255,255,255,0.3); }
  .row-hover:hover {
    background: rgba(255,255,255,0.04) !important;
    transition: background 0.2s ease;
  }
`;
// ─────────────────────────────────────────────────────────────────────────────

const AdminPage = () => {
  const [users, setUsers]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res   = await axios.get('http://localhost:3000/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleUserStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:3000/admin/users/${id}/status`,
        { isActive: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      fetchUsers();
    } catch {
      toast.error('Failed to change user status');
    }
  };

  const filteredUsers = users
    .filter(u => u.role !== 'admin')
    .filter(u =>
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()),
    );

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
                Admin Dashboard
              </h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                Manage and monitor all user accounts
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              placeholder="Search users…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="search-input pl-9 pr-4 py-2 text-sm w-56"
              style={glassInput}
            />
          </div>
        </div>

        {/* ── Stats pill ── */}
        <div className="flex gap-3 mb-6">
          {[
            { label: 'Total Users',  value: users.filter(u => u.role !== 'admin').length, color: 'var(--accent)' },
            { label: 'Active',       value: users.filter(u => u.role !== 'admin' && u.isActive).length,  color: '#22c55e' },
            { label: 'Inactive',     value: users.filter(u => u.role !== 'admin' && !u.isActive).length, color: '#f87171' },
          ].map(({ label, value, color }) => (
            <div key={label} className="px-4 py-2.5 rounded-xl flex items-center gap-2.5" style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <span className="text-lg font-bold" style={{ color }}>{value}</span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</span>
            </div>
          ))}
        </div>

        {/* ── Table ── */}
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
        ) : (
          <div className="rounded-xl overflow-hidden" style={{
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.02)',
          }}>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    {['Name', 'Email', 'Role', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest"
                        style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-5 py-12 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div style={{
                              padding: 16, borderRadius: '50%',
                              background: 'rgba(255,255,255,0.04)',
                              border: '1px solid rgba(255,255,255,0.08)',
                            }}>
                              <Users className="w-6 h-6" style={{ color: 'var(--text-muted)' }} />
                            </div>
                            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                              No users found.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : filteredUsers.map((user, i) => (
                      <motion.tr
                        key={user._id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ delay: i * 0.04, duration: 0.25 }}
                        className="row-hover"
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                      >
                        {/* Name */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {/* Avatar */}
                            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                              style={{
                                background: 'linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 60%, #000))',
                                boxShadow: '0 0 10px color-mix(in srgb, var(--accent) 25%, transparent)',
                              }}>
                              {(user.name || user.email || 'U')[0].toUpperCase()}
                            </div>
                            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                              {user.name}
                            </span>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-5 py-4">
                          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                            {user.email}
                          </span>
                        </td>

                        {/* Role badge */}
                        <td className="px-5 py-4">
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium capitalize"
                            style={user.role === 'admin' ? {
                              background: 'rgba(168,85,247,0.12)',
                              color: '#c084fc',
                              border: '1px solid rgba(168,85,247,0.25)',
                            } : {
                              background: 'color-mix(in srgb, var(--accent) 12%, transparent)',
                              color: 'var(--accent)',
                              border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)',
                            }}>
                            {user.role}
                          </span>
                        </td>

                        {/* Status badge */}
                        <td className="px-5 py-4">
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium"
                            style={user.isActive ? {
                              background: 'rgba(34,197,94,0.12)',
                              color: '#4ade80',
                              border: '1px solid rgba(34,197,94,0.25)',
                            } : {
                              background: 'rgba(239,68,68,0.10)',
                              color: '#f87171',
                              border: '1px solid rgba(239,68,68,0.22)',
                            }}>
                            {user.isActive ? '● Active' : '○ Inactive'}
                          </span>
                        </td>

                        {/* Toggle action */}
                        <td className="px-5 py-4">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleUserStatus(user._id, user.isActive)}
                            className="p-2 rounded-lg transition-all"
                            title={user.isActive ? 'Deactivate User' : 'Activate User'}
                            style={user.isActive ? {
                              background: 'rgba(239,68,68,0.08)',
                              border: '1px solid rgba(239,68,68,0.20)',
                            } : {
                              background: 'rgba(34,197,94,0.08)',
                              border: '1px solid rgba(34,197,94,0.20)',
                            }}
                          >
                            {user.isActive
                              ? <MonitorOff className="w-4 h-4 text-red-400" />
                              : <MonitorCheck className="w-4 h-4 text-green-400" />}
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default AdminPage;