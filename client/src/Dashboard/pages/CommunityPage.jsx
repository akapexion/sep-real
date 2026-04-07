// src/Dashboard/pages/CommunityPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:3000';

const CommunityPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = currentUser._id;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users?userId=${userId}`);
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
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update follow status");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="w-8 h-8 rounded-full border-4 border-[var(--border)] border-t-[var(--accent)] animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 animate-in fade-in duration-300">
      <Toaster />
      <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--accent)" }}>Community</h2>
      <p className="text-[var(--text-muted)] mb-8">Discover other fitness enthusiasts and track their progress live on your dashboard feed!</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {users.map(u => {
          const isFollowing = u.followers && u.followers.includes(userId);
          return (
            <div key={u._id} className="p-6 rounded-2xl shadow-sm border flex flex-col items-center text-center transition-all hover:scale-[1.02]" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
              <div className="w-20 h-20 outline outline-2 outline-[var(--accent)] outline-offset-4 rounded-full bg-gray-200 mb-5 flex items-center justify-center overflow-hidden">
                 {u.image ? <img src={`${API_BASE_URL}/uploads/${u.image}`} alt={u.name} className="object-cover w-full h-full" /> : <span className="text-2xl font-bold text-gray-500">{u.name[0]}</span>}
              </div>
              <h3 className="font-bold text-xl mb-1" style={{ color: 'var(--text-primary)' }}>{u.name}</h3>
              <p className="text-sm mb-5 font-medium" style={{ color: 'var(--text-muted)' }}>{u.followers?.length || 0} Followers</p>
              
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
    </div>
  );
};

export default CommunityPage;
