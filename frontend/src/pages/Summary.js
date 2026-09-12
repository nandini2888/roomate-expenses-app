import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const Summary = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [summary, setSummary] = useState(null);
  const [summaryError, setSummaryError] = useState('');
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    loadRooms();
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      loadSummary();
    }
  }, [selectedRoom, month]);

  const formatCurrency = (value) => {
    const numericValue = Number(value ?? 0);
    return `$${numericValue.toFixed(2)}`;
  };

  const getBalanceState = (balance) => {
    const numericValue = Number(balance ?? 0);

    if (numericValue > 0) {
      return {
        label: 'Should receive',
        prefix: '+',
        valueTone: 'text-green-600',
        badgeTone: 'bg-green-50 text-green-700 border border-green-200',
      };
    }

    if (numericValue < 0) {
      return {
        label: 'Owes',
        prefix: '-',
        valueTone: 'text-red-600',
        badgeTone: 'bg-red-50 text-red-700 border border-red-200',
      };
    }

    return {
      label: 'Settled',
      prefix: '',
      valueTone: 'text-gray-600',
      badgeTone: 'bg-gray-100 text-gray-700 border border-gray-200',
    };
  };

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

  const loadSummary = async () => {
    if (!selectedRoom) return;

    setSummaryError('');
    setSummary(null);

    try {
      const [year, monthNum] = month.split('-').map(Number);
      const response = await api.get(`/summary/${selectedRoom}`, {
        params: { year, month: monthNum },
      });
      setSummary(response.data);
    } catch (error) {
      console.error('Failed to load summary:', error);
      setSummaryError('Unable to load the monthly summary right now. Please try again later.');
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

      {summaryError && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">{summaryError}</p>
        </div>
      )}

      {summary && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg p-6">
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {formatCurrency(summary.totalExpenses || 0)}
              </div>
              <div className="text-sm font-medium text-gray-500">Total Expenses</div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg p-6">
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {formatCurrency(summary.perPersonShare || 0)}
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
            <p className="text-sm text-gray-500 mb-4">
              Each member's total paid, share, and current balance for this month.
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paid
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
                  {summary.memberBalances?.map((member) => {
                    const balanceState = getBalanceState(member.balance);
                    const balanceAmount = Math.abs(Number(member.balance ?? 0)).toFixed(2);

                    return (
                      <tr key={member.userId}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {member.fullName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(member.totalSpent || 0)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(member.share || 0)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex flex-col items-start">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${balanceState.badgeTone}`}
                            >
                              {balanceState.label}
                            </span>
                            <span className={`mt-1 font-semibold ${balanceState.valueTone}`}>
                              {balanceState.prefix}${balanceAmount}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Settlement Suggestions</h2>
            <p className="text-sm text-gray-500 mb-4">
              These are suggested settlements based on the existing calculated balances for this month.
            </p>

            {summary.settlements && summary.settlements.length > 0 ? (
              <div className="space-y-3">
                {summary.settlements.map((settlement, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4"
                  >
                    <div className="flex items-center flex-wrap gap-2 text-sm text-gray-700">
                      <span className="font-medium text-gray-900">{settlement.fromFullName}</span>
                      <span className="text-gray-500">pays</span>
                      <span className="font-medium text-gray-900">{settlement.toFullName}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Suggested payment
                      </div>
                      <div className="text-lg font-semibold text-primary-600">
                        {formatCurrency(settlement.amount || 0)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                All balances are settled for this month.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Summary;



