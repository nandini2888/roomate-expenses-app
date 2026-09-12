import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const Summary = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    loadRooms();
  }, []);

  const loadSummary = useCallback(async () => {
    if (!selectedRoom) return;
    try {
      const [year, monthNum] = month.split('-').map(Number);
      const response = await api.get(`/summary/${selectedRoom}`, {
        params: { year, month: monthNum },
      });
      setSummary(response.data);
    } catch (error) {
      console.error('Failed to load summary:', error);
    }
  }, [selectedRoom, month]);

  useEffect(() => {
    if (selectedRoom) {
      loadSummary();
    }
  }, [selectedRoom, loadSummary]);

  const loadRooms = async () => {
    try {
      const response = await api.get('/rooms');
      setRooms(response.data);
      if (response.data.length > 0) {
        setSelectedRoom(response.data[0].id);
      }
    } catch (error) {
      console.error('Failed to load rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-gray-600">No rooms found. Create or join a room first.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Monthly Summary</h1>
        <div className="flex items-center space-x-4">
          <select
            value={selectedRoom || ''}
            onChange={(e) => setSelectedRoom(Number(e.target.value))}
            className="block w-64 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </select>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="block rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>
      </div>

      {summary && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg p-6">
              <div className="text-2xl font-bold text-gray-900 mb-2">
                ${summary.totalExpenses?.toFixed(2) || '0.00'}
              </div>
              <div className="text-sm font-medium text-gray-500">Total Expenses</div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg p-6">
              <div className="text-2xl font-bold text-gray-900 mb-2">
                ${summary.perPersonShare?.toFixed(2) || '0.00'}
              </div>
              <div className="text-sm font-medium text-gray-500">Per Person Share</div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg p-6">
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {summary.totalMembers || 0}
              </div>
              <div className="text-sm font-medium text-gray-500">Total Members</div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Member Balances</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Spent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Share
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {summary.memberBalances?.map((member) => (
                    <tr key={member.userId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {member.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${parseFloat(member.totalSpent).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${parseFloat(member.share).toFixed(2)}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                          parseFloat(member.balance) >= 0
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {parseFloat(member.balance) >= 0 ? '+' : ''}
                        ${parseFloat(member.balance).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {summary.settlements && summary.settlements.length > 0 && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Settlement Suggestions</h2>
              <div className="space-y-3">
                {summary.settlements.map((settlement, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-gray-900">
                        {settlement.fromFullName}
                      </span>
                      <span className="text-gray-500">should pay</span>
                      <span className="text-sm font-medium text-gray-900">
                        {settlement.toFullName}
                      </span>
                    </div>
                    <span className="text-lg font-semibold text-primary-600">
                      ${parseFloat(settlement.amount).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Summary;



