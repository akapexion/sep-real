import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:3000';

const CommunityPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = currentUser._id;

  // Fetch users whenever search, role, or sortBy changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 300); // Wait 300ms after user stops typing to call API

    return () => clearTimeout(delayDebounceFn);
  }, [search, role, sortBy]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Pass filters as query parameters
      const res = await axios.get(`${API_BASE_URL}/users`, {
        params: {
          userId: userId,
          search: search,
          role: role,
          sortBy: sortBy
        }
      });
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to load community");
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (targetId) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/users/${targetId}/follow`, { userId });
      toast.success(res.data.message);
      fetchUsers(); // Refresh list to update follower counts
    } catch (err) {
      toast.error("Failed to update follow status");
    }
  };

  return (
    <div className="p-4 animate-in fade-in duration-300">
      <Toaster />
      <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--accent)" }}>Community</h2>
      <p className="text-[var(--text-muted)] mb-8">Discover other fitness enthusiasts and track their progress!</p>
      
      {/* --- FILTER SECTION --- */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 bg-[var(--bg-card)] p-4 rounded-2xl border shadow-sm" style={{ borderColor: 'var(--border)' }}>
        <div className="flex-1">
          <input 
            type="text" 
            placeholder="Search users by name..." 
            className="w-full p-2 rounded-lg bg-transparent border outline-none transition-all focus:ring-2 focus:ring-[var(--accent)]"
            style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex gap-4">
          <select 
            className="p-2 rounded-lg border outline-none cursor-pointer bg-black"
            style={{ borderColor: 'var(--border)'}}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <select 
            className="p-2 rounded-lg bg-black border outline-none cursor-pointer"
            style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="followers">Most Followers</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 rounded-full border-4 border-[var(--border)] border-t-[var(--accent)] animate-spin"></div>
        </div>
      ) : users.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {users.map(u => {
            const isFollowing = u.followers && u.followers.includes(userId);
            return (
              <div key={u._id} className="p-6 rounded-2xl shadow-sm border flex flex-col items-center text-center transition-all hover:scale-[1.02]" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                <div className="w-20 h-20 outline outline-2 outline-[var(--accent)] outline-offset-4 rounded-full bg-gray-200 mb-5 flex items-center justify-center overflow-hidden">
                   {u.image ? <img src={`${API_BASE_URL}/uploads/${u.image}`} alt={u.name} className="object-cover w-full h-full" /> : <span className="text-2xl font-bold text-gray-500">{u.name[0]}</span>}
                </div>
                <h3 className="font-bold text-xl mb-1" style={{ color: 'var(--text-primary)' }}>{u.name}</h3>
                <div className="flex flex-col items-center mb-5">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent)] text-white uppercase font-bold mb-1">
                        {u.role || 'user'}
                    </span>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{u.followers?.length || 0} Followers</p>
                </div>
                
                <button 
                  onClick={() => handleFollow(u._id)}
                  className="w-full py-2.5 rounded-lg font-bold text-sm transition-all"
                  style={{ 
                    backgroundColor: isFollowing ? 'transparent' : 'var(--accent)', 
                    border: isFollowing ? '2px solid var(--border)' : '2px solid var(--accent)',
                    color: isFollowing ? 'var(--text-primary)' : '#fff'
                  }}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center p-12 text-[var(--text-muted)]">
          No users found matching your criteria.
        </div>
      )}
    </div>
  );
};

export default CommunityPage;