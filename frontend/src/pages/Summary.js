import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import {
  WalletIcon,
  ShareIcon,
  UsersIcon,
  ExchangeIcon,
  DownloadIcon,
  ChevronDownIcon,
  CloseIcon,
} from '../components/Icons';
import { PottedSucculentArtwork } from '../components/Artwork';

const Summary = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [settleModalData, setSettleModalData] = useState(null);
  const [exportOpen, setExportOpen] = useState(false);

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

  // Export helper for CSV download
  const handleExportCSV = () => {
    if (!summary?.memberBalances) return;
    const headers = ['Member Name', 'Total Spent', 'Share', 'Net Balance'];
    const rows = summary.memberBalances.map((m) => [
      `"${m.fullName}"`,
      parseFloat(m.totalSpent).toFixed(2),
      parseFloat(m.share).toFixed(2),
      parseFloat(m.balance).toFixed(2),
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Expense_Summary_${month}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setExportOpen(false);
  };

  const handlePrint = () => {
    window.print();
    setExportOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-3 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-500">Calculating balances and settlements...</p>
        </div>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <p className="text-slate-500 text-sm">No rooms found. Create or join a room first to see the summary.</p>
      </div>
    );
  }

  return (
    <div className="space-y-7 animate-fade-in pb-12">
      {/* 1. Header with Breadcrumb, Title & Filters */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-coral-500 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100 inline-block mb-1.5">
            Your Spaces
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <span>Monthly Summary</span>
            <span className="text-xl">📊</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            A detailed view of your shared expenses and balances.
          </p>
        </div>

        {/* Filter Controls: Room selector, Month selector, Export */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Room Selector */}
          <div className="relative">
            <select
              value={selectedRoom || ''}
              onChange={(e) => setSelectedRoom(Number(e.target.value))}
              className="appearance-none pl-4 pr-9 py-2 bg-white border border-[#EAE8E3] rounded-xl text-xs sm:text-sm font-semibold text-slate-800 shadow-soft focus:outline-none focus:ring-2 focus:ring-slate-300 cursor-pointer"
            >
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
              <ChevronDownIcon className="w-4 h-4" />
            </div>
          </div>

          {/* Month input */}
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="py-2 px-3 bg-white border border-[#EAE8E3] rounded-xl text-xs sm:text-sm font-semibold text-slate-800 shadow-soft focus:outline-none focus:ring-2 focus:ring-slate-300 cursor-pointer"
          />

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setExportOpen((prev) => !prev)}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-soft transition"
            >
              <DownloadIcon className="w-4 h-4" />
              <span>Export</span>
              <ChevronDownIcon className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {exportOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-card border border-[#EAE8E3] p-1.5 z-40 animate-fade-in">
                <button
                  onClick={handleExportCSV}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition"
                >
                  Download CSV (.csv)
                </button>
                <button
                  onClick={handlePrint}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition"
                >
                  Print Summary
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Top Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Expenses */}
        <div className="p-5 rounded-3xl bg-white border border-[#EAE8E3] shadow-soft flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
            <WalletIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 tracking-tight">
              ${summary?.totalExpenses ? summary.totalExpenses.toFixed(2) : '0.00'}
            </p>
            <p className="text-xs font-semibold text-slate-400">Total Expenses</p>
          </div>
        </div>

        {/* Per Person Share */}
        <div className="p-5 rounded-3xl bg-white border border-[#EAE8E3] shadow-soft flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center shrink-0">
            <ShareIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 tracking-tight">
              ${summary?.perPersonShare ? summary.perPersonShare.toFixed(2) : '0.00'}
            </p>
            <p className="text-xs font-semibold text-slate-400">Per Person Share</p>
          </div>
        </div>

        {/* Total Members */}
        <div className="p-5 rounded-3xl bg-white border border-[#EAE8E3] shadow-soft flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <UsersIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 tracking-tight">
              {summary?.totalMembers || 0}
            </p>
            <p className="text-xs font-semibold text-slate-400">Total Members</p>
          </div>
        </div>
      </div>

      {/* 3. Main Content Grid: Member Balances & Settlements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Member Balances Table */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-[#EAE8E3] shadow-soft">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900">Member Balances</h3>
            <p className="text-xs text-slate-400">Track spending and balances for every roommate</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Member</th>
                  <th className="pb-3 font-semibold">Total Spent</th>
                  <th className="pb-3 font-semibold">Share</th>
                  <th className="pb-3 font-semibold text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {summary?.memberBalances?.map((member) => {
                  const bal = parseFloat(member.balance);
                  const isPositive = bal >= 0;
                  const initials = (member.fullName || 'User')
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase();

                  return (
                    <tr key={member.userId} className="hover:bg-slate-50/50 transition">
                      <td className="py-3.5 flex items-center space-x-3 font-semibold text-slate-900">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                          {initials}
                        </div>
                        <span>{member.fullName}</span>
                      </td>
                      <td className="py-3.5 text-slate-600 font-medium">
                        ${parseFloat(member.totalSpent).toFixed(2)}
                      </td>
                      <td className="py-3.5 text-slate-600 font-medium">
                        ${parseFloat(member.share).toFixed(2)}
                      </td>
                      <td className="py-3.5 text-right">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                            isPositive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {isPositive ? '+' : ''}${bal.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Settlement Suggestions & Art Card */}
        <div className="lg:col-span-5 space-y-5">
          {/* Settlement Suggestions */}
          <div className="p-6 rounded-3xl bg-white border border-[#EAE8E3] shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Settlement Suggestions</h3>
                <p className="text-xs text-slate-400">Direct steps to zero out all balances</p>
              </div>
              <div className="p-2 rounded-xl bg-rose-50 text-rose-500">
                <ExchangeIcon className="w-4 h-4" />
              </div>
            </div>

            {summary?.settlements && summary.settlements.length > 0 ? (
              <div className="space-y-3">
                {summary.settlements.map((settlement, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-2xl bg-slate-50 border border-[#EAE8E3] flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition hover:bg-slate-100/70"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-900">
                        <span>{settlement.fromFullName}</span>
                        <span className="text-slate-400 font-normal">owes</span>
                        <span className="text-rose-600">{settlement.toFullName}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Settle up to keep things even.</p>
                    </div>

                    <div className="flex items-center space-x-3 self-end sm:self-auto">
                      <span className="text-base font-black text-slate-900 tracking-tight">
                        ${parseFloat(settlement.amount).toFixed(2)}
                      </span>
                      <button
                        onClick={() => {
                          setSettleModalData(settlement);
                        }}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-soft transition"
                      >
                        Settle Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-xs font-semibold text-emerald-600">✓ All balances are settled!</p>
                <p className="text-[11px] text-slate-400 mt-1">No payments are required this cycle.</p>
              </div>
            )}
          </div>

          {/* Abstract Plant Art Card matching Panel 3 */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-50/60 via-sky-50/50 to-emerald-50/60 border border-[#EAE8E3] shadow-soft flex items-center justify-between overflow-hidden">
            <div className="space-y-1 z-10 max-w-[55%]">
              <h4 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight leading-snug">
                Fair splits <br />
                <span className="text-emerald-600 font-serif italic font-normal">brighter tomorrows.</span>
              </h4>
              <p className="text-[11px] text-slate-500">
                Transparent math makes shared homes happy homes.
              </p>
            </div>
            <div className="shrink-0 -mr-2">
              <PottedSucculentArtwork className="w-28 h-28" />
            </div>
          </div>
        </div>
      </div>

      {/* Settlement Helper Dialog Modal */}
      {settleModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-card border border-[#EAE8E3] p-6 animate-fade-in">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900">Settlement Details</h3>
                <p className="text-xs text-slate-400">Payment breakdown to square balances</p>
              </div>
              <button
                onClick={() => setSettleModalData(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-cream-100 border border-[#EAE8E3] text-center">
                <p className="text-xs font-semibold text-slate-500 mb-1">Recommended Transfer</p>
                <p className="text-3xl font-black text-slate-900 tracking-tight">
                  ${parseFloat(settleModalData.amount).toFixed(2)}
                </p>
                <div className="flex items-center justify-center space-x-2 text-xs text-slate-700 font-semibold mt-2.5">
                  <span className="px-2 py-1 bg-white rounded-lg border border-slate-200">
                    {settleModalData.fromFullName}
                  </span>
                  <span className="text-slate-400">pays</span>
                  <span className="px-2 py-1 bg-white rounded-lg border border-slate-200 text-rose-600">
                    {settleModalData.toFullName}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500 text-center leading-relaxed">
                Pay directly via UPI, cash, bank transfer, or payment app. Once settled, balances can be balanced by adding a matching expense entry.
              </p>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSettleModalData(null)}
                  className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition shadow-soft"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Summary;
