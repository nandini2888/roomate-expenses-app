import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import {
  PlusIcon,
  RoomsIcon,
  CopyIcon,
  CheckIcon,
  ArrowRightIcon,
  CloseIcon,
  UsersIcon,
} from '../components/Icons';
import { ModernVillaArtwork } from '../components/Artwork';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', description: '' });
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  const [copiedCode, setCopiedCode] = useState('');

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const response = await api.get('/rooms');
      setRooms(response.data);
    } catch (error) {
      console.error('Failed to load rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/rooms', createForm);
      setShowCreateModal(false);
      setCreateForm({ name: '', description: '' });
      loadRooms();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create room');
    }
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/rooms/join', { joinCode });
      setShowJoinModal(false);
      setJoinCode('');
      loadRooms();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join room');
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2500);
  };

  // Curated room cover presets with warm artistic palettes
  const roomThemes = [
    { bg: 'from-amber-100 via-rose-100 to-indigo-100', iconColor: 'text-amber-600' },
    { bg: 'from-sky-100 via-teal-100 to-emerald-100', iconColor: 'text-sky-600' },
    { bg: 'from-rose-100 via-purple-100 to-pink-100', iconColor: 'text-rose-600' },
    { bg: 'from-indigo-100 via-sky-100 to-blue-100', iconColor: 'text-indigo-600' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-3 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-500">Loading your shared rooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* 1. Header with Breadcrumb & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-coral-500 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100 inline-block mb-1.5">
            Your Spaces
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <span>Rooms</span>
            <span className="text-xl">🏰</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage your rooms, invite members, and keep track of expenses.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              setError('');
              setShowCreateModal(true);
            }}
            className="flex items-center space-x-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-soft transition"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Create Room</span>
          </button>
          <button
            onClick={() => {
              setError('');
              setShowJoinModal(true);
            }}
            className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-[#EAE8E3] hover:border-slate-300 text-slate-800 text-xs sm:text-sm font-bold rounded-xl shadow-soft transition"
          >
            <RoomsIcon className="w-4 h-4 text-emerald-600" />
            <span>Join Room</span>
          </button>
        </div>
      </div>

      {/* 2. Room Cards Grid matching Panel 4 of visual benchmark */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room, idx) => {
          const theme = roomThemes[idx % roomThemes.length];
          const isCopied = copiedCode === room.joinCode;

          return (
            <div
              key={room.id}
              className="bg-white rounded-3xl border border-[#EAE8E3] shadow-soft overflow-hidden flex flex-col justify-between transition hover:shadow-card hover:-translate-y-0.5 duration-200"
            >
              {/* Card Cover Header with Member Badge */}
              <div className={`h-28 bg-gradient-to-tr ${theme.bg} p-4 flex items-start justify-between relative`}>
                <span className="inline-flex items-center space-x-1.5 bg-white/90 backdrop-blur-xs text-slate-800 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>{room.memberCount || 1} member{room.memberCount === 1 ? '' : 's'}</span>
                </span>

                <span className="text-slate-400 hover:text-slate-600 text-xs font-bold bg-white/70 px-2 py-0.5 rounded-lg">
                  •••
                </span>
              </div>

              {/* Room Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-snug">
                    {room.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {room.description || 'No description provided.'}
                  </p>
                </div>

                {/* Member avatars & Join Code Row */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex items-center space-x-1 text-slate-400">
                    <UsersIcon className="w-4 h-4" />
                    <span className="text-xs font-semibold text-slate-600">
                      {room.memberCount || 1}
                    </span>
                  </div>

                  {/* Copyable Join Code Pill */}
                  <button
                    onClick={() => handleCopyCode(room.joinCode)}
                    className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono font-semibold transition"
                    title="Click to copy join code"
                  >
                    <span>Code: {room.joinCode}</span>
                    {isCopied ? (
                      <CheckIcon className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <CopyIcon className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>
                </div>

                {/* Action Link Button */}
                <Link
                  to={`/expenses?roomId=${room.id}`}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-soft"
                >
                  <span>View Expenses</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Bottom Storytelling Banner matching Panel 4 of benchmark */}
      <div className="rounded-3xl bg-gradient-to-r from-sky-50 via-emerald-50 to-amber-50 border border-[#EAE8E3] shadow-soft overflow-hidden p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative">
        <div className="space-y-2 z-10 max-w-md">
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
            More than just rooms. <br />
            <span className="font-serif italic font-normal text-slate-600 text-xl sm:text-2xl">
              People. Places. Possibilities.
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Your home is where memories happen. We handle the split calculations so you can enjoy living together.
          </p>
          <p className="font-serif italic text-xs text-rose-500 font-semibold pt-2">
            Good Roommates Brighter Days. ♡
          </p>
        </div>

        {/* Bespoke Architectural Villa Artwork */}
        <div className="w-full md:w-80 h-36 rounded-2xl overflow-hidden shadow-card border border-white/80 shrink-0">
          <ModernVillaArtwork className="w-full h-full" />
        </div>
      </div>

      {/* 4. Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-card border border-[#EAE8E3] p-6 sm:p-7 animate-fade-in">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900">Create New Room</h3>
                <p className="text-xs text-slate-400">Set up a space for your apartment or flat</p>
              </div>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setError('');
                }}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Room Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat 104, Sunset Apartment"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Description
                </label>
                <textarea
                  placeholder="e.g. 3 BHK in Koramangala with 4 roommates"
                  rows="3"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setError('');
                    setCreateForm({ name: '', description: '' });
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-soft"
                >
                  Create Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Join Room Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-card border border-[#EAE8E3] p-6 sm:p-7 animate-fade-in">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900">Join a Room</h3>
                <p className="text-xs text-slate-400">Enter the 8-character invite code from your roommate</p>
              </div>
              <button
                onClick={() => {
                  setShowJoinModal(false);
                  setError('');
                }}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleJoinRoom} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Invite Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 6BD02829"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-mono uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowJoinModal(false);
                    setError('');
                    setJoinCode('');
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-soft"
                >
                  Join Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;
