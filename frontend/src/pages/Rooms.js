import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const getInitials = (name = '') =>
  name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() || '')
    .join('');

// ─── Sub-components ──────────────────────────────────────────────────────────

/** Avatar circle with initials */
const Avatar = ({ name }) => (
  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold">
    {getInitials(name)}
  </div>
);

/** Role badge */
const RoleBadge = ({ role }) =>
  role === 'ADMIN' ? (
    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
      Admin
    </span>
  ) : (
    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
      Member
    </span>
  );

/** Spinner for loading states */
const Spinner = ({ size = 4 }) => (
  <svg
    className={`animate-spin h-${size} w-${size} text-current`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);

// ─── Main Component ──────────────────────────────────────────────────────────

const Rooms = () => {
  const { user } = useAuth();

  // Rooms list
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', description: '' });
  const [createError, setCreateError] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Join modal
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  // Member panel: { [roomId]: { members: [], loading: bool } }
  const [memberData, setMemberData] = useState({});
  const [expandedRoomId, setExpandedRoomId] = useState(null);

  // Copy-code feedback: { [roomId]: bool }
  const [copiedRoom, setCopiedRoom] = useState({});

  // Confirm dialog for remove/leave
  const [confirmDialog, setConfirmDialog] = useState(null);
  // confirmDialog = { roomId, memberId, label, onConfirm }

  // ── Data loading ────────────────────────────────────────────────────────

  const loadRooms = useCallback(async () => {
    try {
      const response = await api.get('/rooms');
      setRooms(response.data);
    } catch (error) {
      console.error('Failed to load rooms:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  const loadMembers = async (roomId) => {
    setMemberData((prev) => ({
      ...prev,
      [roomId]: { members: prev[roomId]?.members || [], loading: true },
    }));
    try {
      const response = await api.get(`/rooms/${roomId}/members`);
      setMemberData((prev) => ({
        ...prev,
        [roomId]: { members: response.data, loading: false },
      }));
    } catch (error) {
      console.error('Failed to load members:', error);
      setMemberData((prev) => ({
        ...prev,
        [roomId]: { members: [], loading: false },
      }));
    }
  };

  // ── Create Room ─────────────────────────────────────────────────────────

  const openCreateModal = () => {
    setCreateError('');
    setCreateForm({ name: '', description: '' });
    setShowCreateModal(true);
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setCreateError('');
    const trimmedName = createForm.name.trim();
    if (!trimmedName) {
      setCreateError('Room name cannot be empty.');
      return;
    }
    setIsCreating(true);
    try {
      await api.post('/rooms', { name: trimmedName, description: createForm.description.trim() });
      setShowCreateModal(false);
      setCreateForm({ name: '', description: '' });
      loadRooms();
    } catch (err) {
      setCreateError(err.response?.data?.message || 'Failed to create room');
    } finally {
      setIsCreating(false);
    }
  };

  // ── Join Room ───────────────────────────────────────────────────────────

  const openJoinModal = () => {
    setJoinError('');
    setJoinCode('');
    setShowJoinModal(true);
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    setJoinError('');
    if (joinCode.length !== 8) {
      setJoinError('Join code must be exactly 8 characters.');
      return;
    }
    setIsJoining(true);
    try {
      await api.post('/rooms/join', { joinCode });
      setShowJoinModal(false);
      setJoinCode('');
      loadRooms();
    } catch (err) {
      setJoinError(err.response?.data?.message || 'Failed to join room');
    } finally {
      setIsJoining(false);
    }
  };

  // ── Member panel toggle ─────────────────────────────────────────────────

  const toggleMembers = (roomId) => {
    if (expandedRoomId === roomId) {
      setExpandedRoomId(null);
    } else {
      setExpandedRoomId(roomId);
      // Load members if not already cached
      if (!memberData[roomId]?.members?.length) {
        loadMembers(roomId);
      }
    }
  };

  // ── Copy join code ──────────────────────────────────────────────────────

  const handleCopyCode = async (roomId, code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedRoom((prev) => ({ ...prev, [roomId]: true }));
      setTimeout(() => setCopiedRoom((prev) => ({ ...prev, [roomId]: false })), 2000);
    } catch {
      // fallback: do nothing silently
    }
  };

  // ── Remove / Leave member ───────────────────────────────────────────────

  const handleRemoveMember = (roomId, memberId, label) => {
    setConfirmDialog({
      roomId,
      memberId,
      label,
      onConfirm: async () => {
        try {
          await api.delete(`/rooms/${roomId}/members/${memberId}`);
          setConfirmDialog(null);
          // Refresh room list and member cache
          await loadRooms();
          await loadMembers(roomId);
        } catch (err) {
          console.error('Failed to remove member:', err);
          setConfirmDialog(null);
        }
      },
    });
  };

  // ── Derived helpers ─────────────────────────────────────────────────────

  /** Returns the current user's role in a room ('ADMIN' | 'MEMBER' | null) */
  const getCurrentUserRole = (room) => {
    if (!user) return null;
    const me = room.members?.find((m) => m.userId === user.id);
    return me?.role || null;
  };

  // ── Render ──────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* ── Page header ── */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Rooms</h1>
        <div className="flex space-x-3">
          <button
            id="btn-create-room"
            onClick={openCreateModal}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            + Create Room
          </button>
          <button
            id="btn-join-room"
            onClick={openJoinModal}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Join Room
          </button>
        </div>
      </div>

      {/* ── Empty state ── */}
      {rooms.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="text-6xl mb-4">🏠</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Rooms Yet</h2>
          <p className="text-gray-500 mb-6">
            Create a new room or join one with a code to start splitting expenses.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={openCreateModal}
              className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-md text-sm font-medium transition-colors"
            >
              + Create Room
            </button>
            <button
              onClick={openJoinModal}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Join Room
            </button>
          </div>
        </div>
      )}

      {/* ── Room cards grid ── */}
      {rooms.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => {
            const currentUserRole = getCurrentUserRole(room);
            const isExpanded = expandedRoomId === room.id;
            const roomMembers = memberData[room.id];
            const membersLoading = roomMembers?.loading;
            const membersList = roomMembers?.members || [];

            return (
              <div
                key={room.id}
                className="bg-white rounded-xl shadow-md border border-gray-100 flex flex-col overflow-hidden"
              >
                {/* Card body */}
                <div className="p-6 flex-1">
                  {/* Room name */}
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{room.name}</h3>

                  {/* Description */}
                  <p className="text-gray-500 text-sm mb-3 min-h-[1.25rem]">
                    {room.description || <span className="italic text-gray-400">No description</span>}
                  </p>

                  {/* Meta: creator + date */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 mb-4">
                    <span>
                      👤 Created by <span className="font-medium text-gray-600">{room.createdByUsername}</span>
                    </span>
                    <span>📅 {formatDate(room.createdAt)}</span>
                  </div>

                  {/* Join code row */}
                  <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 mb-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Join Code</p>
                      <span className="font-mono font-bold text-gray-800 tracking-widest text-sm">
                        {room.joinCode}
                      </span>
                    </div>
                    <button
                      id={`btn-copy-code-${room.id}`}
                      onClick={() => handleCopyCode(room.id, room.joinCode)}
                      title="Copy join code"
                      className="ml-3 flex items-center gap-1 text-xs px-2 py-1 rounded-md border border-gray-200 bg-white hover:bg-primary-50 hover:border-primary-300 text-gray-500 hover:text-primary-700 transition-colors"
                    >
                      {copiedRoom[room.id] ? (
                        <>
                          <span>✓</span>
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <span>📋</span>
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Members count */}
                  <p className="text-sm text-gray-500 mb-4">
                    👥 <span className="font-medium text-gray-700">{room.memberCount || 0}</span>{' '}
                    {room.memberCount === 1 ? 'member' : 'members'}
                  </p>
                </div>

                {/* Card actions */}
                <div className="px-6 pb-4 flex flex-wrap gap-2">
                  <Link
                    to={`/expenses?roomId=${room.id}`}
                    className="flex-1 text-center bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    View Expenses
                  </Link>
                  <button
                    id={`btn-toggle-members-${room.id}`}
                    onClick={() => toggleMembers(room.id)}
                    className="flex-1 text-center border border-gray-300 hover:border-primary-400 hover:text-primary-700 text-gray-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    {isExpanded ? 'Hide Members ▲' : 'View Members ▼'}
                  </button>
                  {/* Leave Room button (for non-admin members) */}
                  {currentUserRole === 'MEMBER' && user && (
                    <button
                      id={`btn-leave-room-${room.id}`}
                      onClick={() =>
                        handleRemoveMember(room.id, user.id, `Leave "${room.name}"`)
                      }
                      className="flex-1 text-center border border-red-200 hover:bg-red-50 text-red-500 hover:text-red-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Leave Room
                    </button>
                  )}
                </div>

                {/* ── Expandable member panel ── */}
                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Room Members</h4>

                    {membersLoading && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Spinner size={4} />
                        <span>Loading members…</span>
                      </div>
                    )}

                    {!membersLoading && membersList.length === 0 && (
                      <p className="text-sm text-gray-400">No members found.</p>
                    )}

                    {!membersLoading && membersList.length > 0 && (
                      <ul className="space-y-2">
                        {membersList.map((member) => {
                          const isSelf = user && member.userId === user.id;
                          const canRemove =
                            currentUserRole === 'ADMIN' && !isSelf;

                          return (
                            <li
                              key={member.id}
                              className="flex items-center justify-between gap-2 bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-100"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <Avatar name={member.fullName} />
                                <div className="min-w-0">
                                  <div className="flex items-center flex-wrap gap-x-1">
                                    <span className="text-sm font-medium text-gray-900 truncate">
                                      {member.fullName}
                                    </span>
                                    {isSelf && (
                                      <span className="text-xs text-primary-500 font-medium">(you)</span>
                                    )}
                                    <RoleBadge role={member.role} />
                                  </div>
                                  <p className="text-xs text-gray-400 mt-0.5">
                                    Joined {formatDate(member.joinedAt)}
                                  </p>
                                </div>
                              </div>

                              {/* Admin: Remove button */}
                              {canRemove && (
                                <button
                                  id={`btn-remove-member-${room.id}-${member.userId}`}
                                  onClick={() =>
                                    handleRemoveMember(
                                      room.id,
                                      member.userId,
                                      `Remove ${member.fullName} from "${room.name}"`
                                    )
                                  }
                                  className="flex-shrink-0 text-xs text-red-500 hover:text-red-700 border border-red-200 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                                >
                                  Remove
                                </button>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Create Room Modal ── */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-5">Create New Room</h3>

            {createError && (
              <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateRoom} noValidate>
              <div className="mb-4">
                <label htmlFor="create-room-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Room Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="create-room-name"
                  type="text"
                  required
                  maxLength={100}
                  placeholder="e.g. Apartment 4B"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                />
                <p className="text-xs text-gray-400 mt-1">{createForm.name.length}/100 characters</p>
              </div>

              <div className="mb-6">
                <label htmlFor="create-room-desc" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="create-room-desc"
                  rows="3"
                  maxLength={500}
                  placeholder="Optional — describe this room"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm resize-none"
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                />
                <p className="text-xs text-gray-400 mt-1">{createForm.description.length}/500 characters</p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setCreateError('');
                    setCreateForm({ name: '', description: '' });
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="btn-create-room-submit"
                  type="submit"
                  disabled={isCreating}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {isCreating && <Spinner size={4} />}
                  {isCreating ? 'Creating…' : 'Create Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Join Room Modal ── */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Join a Room</h3>
            <p className="text-sm text-gray-500 mb-5">
              Enter the 8-character code shared by your roommate.
            </p>

            {joinError && (
              <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                {joinError}
              </div>
            )}

            <form onSubmit={handleJoinRoom} noValidate>
              <div className="mb-2">
                <label htmlFor="join-room-code" className="block text-sm font-medium text-gray-700 mb-1">
                  Join Code <span className="text-red-500">*</span>
                </label>
                <input
                  id="join-room-code"
                  type="text"
                  required
                  maxLength={8}
                  placeholder="E.g. A1B2C3D4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 uppercase tracking-widest text-center font-mono text-lg"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                />
              </div>

              {/* Inline length feedback */}
              {joinCode.length > 0 && joinCode.length < 8 && (
                <p className="text-xs text-amber-600 mb-4">
                  {8 - joinCode.length} more character{8 - joinCode.length !== 1 ? 's' : ''} needed
                </p>
              )}
              {joinCode.length === 0 && <div className="mb-4" />}
              {joinCode.length === 8 && (
                <p className="text-xs text-green-600 mb-4">✓ Code looks good</p>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowJoinModal(false);
                    setJoinError('');
                    setJoinCode('');
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="btn-join-room-submit"
                  type="submit"
                  disabled={isJoining || joinCode.length !== 8}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {isJoining && <Spinner size={4} />}
                  {isJoining ? 'Joining…' : 'Join Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Confirm Dialog (Remove / Leave) ── */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Are you sure?</h3>
            <p className="text-sm text-gray-600 mb-6">{confirmDialog.label}</p>
            <div className="flex justify-end space-x-3">
              <button
                id="btn-confirm-cancel"
                onClick={() => setConfirmDialog(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                id="btn-confirm-proceed"
                onClick={confirmDialog.onConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;
