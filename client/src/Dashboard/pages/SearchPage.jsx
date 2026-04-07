// src/Dashboard/pages/SearchPage.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';

  const [results, setResults] = useState({ workouts: [], nutrition: [], users: [] });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('workouts');

  useEffect(() => {
    if (q) {
      searchAll(q);
    }
  }, [q]);

  const searchAll = async (query) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/search?q=${query}`);
      setResults(res.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="p-4 animate-in fade-in zoom-in duration-300">
      <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--accent)" }}>Search Results for &quot;{q}&quot;</h2>
      
      <div className="flex space-x-4 mb-6 border-b border-[var(--border)] overflow-x-auto">
        {['workouts', 'nutrition', 'users'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 px-4 whitespace-nowrap capitalize font-medium transition-colors ${activeTab === tab ? 'border-b-2 border-[var(--accent)] text-[var(--accent)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
          >
            {tab} ({results[tab].length})
          </button>
        ))}
      </div>

      {loading ? (
         <div className="flex justify-center p-12">
            <div className="w-8 h-8 rounded-full border-4 border-[var(--border)] border-t-[var(--accent)] animate-spin"></div>
         </div>
      ) : (
         <div className="bg-[var(--bg-card)] rounded-xl p-6 shadow-sm border border-[var(--border)]">
           {activeTab === 'workouts' && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.workouts.length === 0 && <p className="text-[var(--text-muted)] col-span-full">No workouts found.</p>}
                {results.workouts.map(w => (
                  <div key={w._id} className="p-4 border border-[var(--border)] bg-[var(--bg-secondary)] rounded-lg hover:border-[var(--accent)] transition-colors">
                     <p className="font-semibold text-[var(--text-primary)] text-lg mb-1">{w.exerciseName}</p>
                     <span className="inline-block px-2 py-1 bg-[var(--input-bg)] text-[var(--text-muted)] text-xs rounded mb-3">{w.category}</span>
                     <p className="text-sm text-[var(--text-muted)] mb-1">Posted by: <strong>{w.userId?.name}</strong></p>
                     <p className="text-sm text-[var(--text-secondary)]">{w.sets} sets x {w.reps} reps @ {w.weights}kg</p>
                  </div>
                ))}
             </div>
           )}

           {activeTab === 'nutrition' && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.nutrition.length === 0 && <p className="text-[var(--text-muted)] col-span-full">No nutrition logs found.</p>}
                {results.nutrition.map(n => (
                  <div key={n._id} className="p-4 border border-[var(--border)] bg-[var(--bg-secondary)] rounded-lg hover:border-[var(--accent)] transition-colors">
                     <p className="font-semibold text-[var(--text-primary)] text-lg mb-1">{n.mealType}</p>
                     <p className="text-sm text-[var(--text-primary)] mb-3">{n.foodItems.map(i => i.name).join(', ')}</p>
                     <p className="text-sm text-[var(--text-muted)] mb-1">Posted by: <strong>{n.userId?.name}</strong></p>
                     <p className="text-xs text-[var(--text-muted)]">{new Date(n.date).toLocaleDateString()}</p>
                  </div>
                ))}
             </div>
           )}

           {activeTab === 'users' && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.users.length === 0 && <p className="text-[var(--text-muted)] col-span-full">No users found.</p>}
                {results.users.map(u => (
                  <div key={u._id} className="flex items-center space-x-4 p-4 border border-[var(--border)] bg-[var(--bg-secondary)] rounded-lg hover:border-[var(--accent)] transition-colors">
                     <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300">
                        {u.image ? <img src={`${API_BASE_URL}/uploads/${u.image}`} alt={u.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex justify-center items-center font-bold text-gray-500">{u.name[0]}</div>}
                     </div>
                     <div>
                       <p className="font-bold text-[var(--text-primary)] text-lg leading-tight">{u.name}</p>
                       <p className="text-xs text-[var(--text-muted)]">{u.followers?.length || 0} followers</p>
                     </div>
                  </div>
                ))}
             </div>
           )}
         </div>
      )}
    </div>
  );
};

export default SearchPage;
