import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Search, MonitorOff, MonitorCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3000/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleUserStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:3000/admin/users/${id}/status`, {
        isActive: !currentStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to change user status');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <Toaster />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl shadow-lg p-6"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>Admin Dashboard</h2>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-full focus:outline-none focus:ring-2"
              style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
            />
          </div>
        </div>

        {loading ? (
          <p className="text-center py-8" style={{ color: 'var(--text-muted)' }}>Loading users...</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border" style={{ borderColor: 'var(--border)' }}>
            <table className="w-full text-left">
              <thead className="bg-[var(--bg-card-hover)]">
                <tr style={{ color: 'var(--text-muted)' }}>
                  <th className="px-6 py-3 font-medium text-sm">Name</th>
                  <th className="px-6 py-3 font-medium text-sm">Email</th>
                  <th className="px-6 py-3 font-medium text-sm">Role</th>
                  <th className="px-6 py-3 font-medium text-sm">Status</th>
                  <th className="px-6 py-3 font-medium text-sm text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {filteredUsers.filter(user => user.role !== 'admin').length > 0 ? filteredUsers.filter(user => user.role !== 'admin').map(user => (
                  <tr key={user._id} className="hover:bg-[var(--bg-card-hover)] transition">
                    <td className="px-6 py-4" style={{ color: 'var(--text-primary)' }}>{user.name}</td>
                    <td className="px-6 py-4" style={{ color: 'var(--text-primary)' }}>{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => toggleUserStatus(user._id, user.isActive)}
                        className={`p-2 rounded-full transition-colors ${user.isActive ? 'hover:bg-red-100 text-red-500' : 'hover:bg-green-100 text-green-500'}`}
                        title={user.isActive ? "Deactivate User" : "Activate User"}
                      >
                        {user.isActive ? <MonitorOff className="w-5 h-5" /> : <MonitorCheck className="w-5 h-5" />}
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center" style={{ color: 'var(--text-muted)' }}>
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div >
        )}
      </motion.div >
    </div >
  );
};

export default AdminPage;
