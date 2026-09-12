import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import {
  WalletIcon,
  ShareIcon,
  UsersIcon,
  PlusIcon,
  ArrowRightIcon,
  RoomsIcon,
  ChevronDownIcon,
} from '../components/Icons';
import { TwilightArchArtwork } from '../components/Artwork';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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

  // Curated harmonious color palette for charts matching design system
  const COLORS = ['#F43F5E', '#0EA5E9', '#10B981', '#F59E0B', '#6366F1', '#EC4899', '#8B5CF6'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-3 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-500">Loading your space dashboard...</p>
        </div>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-3xl bg-white border border-[#EAE8E3] shadow-soft flex items-center justify-center mx-auto mb-5 text-primary-600">
          <RoomsIcon className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          No Shared Spaces Found
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
          You aren't a member of any rooms yet. Create a new room for your apartment or join one with an invite code.
        </p>
        <Link
          to="/rooms"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-soft transition"
        >
          <span>Explore Rooms</span>
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const categoryData = summary?.expensesByCategory
    ? Object.entries(summary.expensesByCategory).map(([name, value]) => ({
        name,
        value: parseFloat(value),
      }))
    : [];

  const memberData = summary?.expensesByMember
    ? Object.entries(summary.expensesByMember).map(([name, value]) => ({
        name,
        value: parseFloat(value),
      }))
    : [];

  const totalExpenseNum = summary?.totalExpenses ? parseFloat(summary.totalExpenses) : 0;

  return (
    <div className="space-y-7 animate-fade-in pb-12">
      {/* 1. Header Banner & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Greeting */}
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Good to see you, {user?.fullName?.split(' ')[0] || user?.username || 'Friend'}!
            </h1>
            <span className="text-2xl">👋</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Here's what's happening with your shared expenses.
          </p>
        </div>

        {/* Action Controls: Room Picker, Month Picker, Add Expense */}
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

          {/* Month Picker */}
          <div className="relative flex items-center">
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="py-2 px-3 bg-white border border-[#EAE8E3] rounded-xl text-xs sm:text-sm font-semibold text-slate-800 shadow-soft focus:outline-none focus:ring-2 focus:ring-slate-300 cursor-pointer"
            />
          </div>

          {/* Add Expense Button */}
          <button
            onClick={() => navigate(`/expenses?roomId=${selectedRoom}`)}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-soft transition"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* 2. Highlight Story Card & Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Story Inspiration Card matching Panel 2 of benchmark */}
        <div className="lg:col-span-4 p-5 rounded-3xl bg-gradient-to-br from-indigo-50/70 via-rose-50/50 to-amber-50/60 border border-[#EAE8E3] shadow-soft flex items-center justify-between overflow-hidden relative">
          <div className="space-y-1.5 z-10 max-w-[65%]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-white/80 px-2 py-0.5 rounded-full border border-indigo-100">
              Living Together
            </span>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight leading-snug">
              Shared spaces. <br />
              <span className="text-coral-500 font-serif italic font-normal">Greater stories.</span>
            </h3>
            <p className="text-[11px] text-slate-500 leading-normal">
              Little expenses. Big memories. Everything balanced.
            </p>
          </div>
          <div className="shrink-0 relative -mr-2">
            <TwilightArchArtwork className="w-24 h-24" />
          </div>
        </div>

        {/* 3 Metric Cards matching Benchmark */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: Total Expenses */}
          <div className="p-5 rounded-3xl bg-white border border-[#EAE8E3] shadow-soft flex flex-col justify-between transition hover:shadow-card">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center">
                <WalletIcon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                This cycle
              </span>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 tracking-tight">
                ${summary ? summary.totalExpenses?.toFixed(2) : '0.00'}
              </p>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">Total Expenses</p>
            </div>
          </div>

          {/* Card 2: Per Person Share */}
          <div className="p-5 rounded-3xl bg-white border border-[#EAE8E3] shadow-soft flex flex-col justify-between transition hover:shadow-card">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center">
                <ShareIcon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">
                Equal Split
              </span>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 tracking-tight">
                ${summary ? summary.perPersonShare?.toFixed(2) : '0.00'}
              </p>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">Per Person Share</p>
            </div>
          </div>

          {/* Card 3: Total Members */}
          <div className="p-5 rounded-3xl bg-white border border-[#EAE8E3] shadow-soft flex flex-col justify-between transition hover:shadow-card">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                <UsersIcon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Active Room
              </span>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 tracking-tight">
                {summary?.totalMembers || 0}
              </p>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">Total Members</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Charts Section matching Panel 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Expenses by Category (Donut with center total & legend) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-[#EAE8E3] shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Expenses by Category</h3>
              <p className="text-xs text-slate-400">Spending distributed by category</p>
            </div>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
              This Month
            </span>
          </div>

          {categoryData.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-4 py-2">
              {/* Donut Pie Chart */}
              <div className="sm:col-span-7 h-56 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={58}
                      outerRadius={82}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke="#FFFFFF"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val) => [`$${parseFloat(val).toFixed(2)}`, 'Amount']}
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #EAE8E3',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Central Donut Total */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs text-slate-400 font-semibold">Total</span>
                  <span className="text-base font-black text-slate-900 tracking-tight">
                    ${totalExpenseNum.toFixed(0)}
                  </span>
                </div>
              </div>

              {/* Legend List with Percentages */}
              <div className="sm:col-span-5 space-y-2 text-xs">
                {categoryData.map((item, index) => {
                  const percent = totalExpenseNum > 0 ? Math.round((item.value / totalExpenseNum) * 100) : 0;
                  return (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 truncate">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-slate-600 font-medium truncate">{item.name}</span>
                      </div>
                      <span className="font-bold text-slate-800 ml-2">{percent}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-slate-400 text-xs">
              No category expenses recorded for this month
            </div>
          )}
        </div>

        {/* Chart 2: Expenses by Member (Rounded BarChart) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-[#EAE8E3] shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Expenses by Member</h3>
              <p className="text-xs text-slate-400">Total amount paid by each roommate</p>
            </div>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
              This Month
            </span>
          </div>

          {memberData.length > 0 ? (
            <div className="h-56 py-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={memberData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#64748B', fontSize: 11, fontWeight: 500 }}
                    axisLine={{ stroke: '#E2E8F0' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#94A3B8', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => `$${val}`}
                  />
                  <Tooltip
                    formatter={(val) => [`$${parseFloat(val).toFixed(2)}`, 'Paid']}
                    cursor={{ fill: '#F8FAFC' }}
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #EAE8E3',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}
                  />
                  <Bar dataKey="value" fill="#FB7185" radius={[8, 8, 0, 0]} maxBarSize={45} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="py-16 text-center text-slate-400 text-xs">
              No member payments recorded for this month
            </div>
          )}
        </div>
      </div>

      {/* 4. Member Balances Table Preview */}
      <div className="p-6 rounded-3xl bg-white border border-[#EAE8E3] shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Member Balances</h3>
            <p className="text-xs text-slate-400">Current standing after equal split calculation</p>
          </div>
          <Link
            to="/summary"
            className="text-xs font-bold text-slate-900 hover:text-rose-600 flex items-center space-x-1.5 transition"
          >
            <span>View Full Summary</span>
            <ArrowRightIcon className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                <th className="pb-3 font-semibold">Member</th>
                <th className="pb-3 font-semibold">Total Spent</th>
                <th className="pb-3 font-semibold">Equal Share</th>
                <th className="pb-3 font-semibold text-right">Net Balance</th>
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
                  <tr key={member.userId} className="hover:bg-slate-50/60 transition">
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
    </div>
  );
};

export default Dashboard;
