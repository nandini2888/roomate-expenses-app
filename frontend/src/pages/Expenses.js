import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import { validateExpenseForm } from '../utils/expenseValidation';
import {
  PlusIcon,
  ReceiptIcon,
  EditIcon,
  TrashIcon,
  CloseIcon,
  SearchIcon,
  ChevronDownIcon,
} from '../components/Icons';

const Expenses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryRoomId = searchParams.get('roomId');
  const [roomId, setRoomId] = useState(queryRoomId || '');
  const [expenses, setExpenses] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    expenseDate: new Date().toISOString().split('T')[0],
    categoryId: '',
    splitType: 'EQUAL',
    paidById: '',
    splits: [],
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [billFile, setBillFile] = useState(null);
  const [billPreview, setBillPreview] = useState(null);

  useEffect(() => {
    if (queryRoomId && queryRoomId !== roomId) {
      setRoomId(queryRoomId);
    }
  }, [queryRoomId, roomId]);

  const loadRooms = useCallback(async () => {
    try {
      const response = await api.get('/rooms');
      setRooms(response.data);
      if (!roomId && response.data.length > 0) {
        const firstRoomId = response.data[0].id.toString();
        setRoomId(firstRoomId);
        setSearchParams({ roomId: firstRoomId }, { replace: true });
      } else if (!roomId) {
        setLoading(false);
      }
    } catch (error) {
      console.error('Failed to load rooms:', error);
      setLoading(false);
    }
  }, [roomId, setSearchParams]);

  const loadCategories = useCallback(async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  }, []);

  const loadExpenses = useCallback(async () => {
    if (!roomId) return;
    try {
      const response = await api.get('/expenses', {
        params: { roomId, size: 100 },
      });
      setExpenses(response.data.content || response.data);
    } catch (error) {
      console.error('Failed to load expenses:', error);
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  const loadMembers = useCallback(async () => {
    if (!roomId) return;
    try {
      const response = await api.get(`/rooms/${roomId}/members`);
      setMembers(response.data);
      if (response.data.length > 0) {
        setFormData((prev) => (prev.paidById ? prev : { ...prev, paidById: response.data[0].userId.toString() }));
      }
    } catch (error) {
      console.error('Failed to load members:', error);
    }
  }, [roomId]);

  useEffect(() => {
    loadRooms();
    loadCategories();
  }, [loadRooms, loadCategories]);

  useEffect(() => {
    if (roomId) {
      loadExpenses();
      loadMembers();
    }
  }, [roomId, loadExpenses, loadMembers]);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Run client-side validation
    const validation = validateExpenseForm(formData, roomId);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      if (validation.errors.general) {
        setError(validation.errors.general);
      }
      return;
    }
    setFieldErrors({});

    const payload = {
      ...formData,
      description: formData.description.trim(),
      roomId: Number(roomId),
      paidById: Number(formData.paidById),
      amount: parseFloat(formData.amount),
      categoryId: formData.categoryId ? Number(formData.categoryId) : null,
      splits:
        formData.splitType === 'CUSTOM'
          ? formData.splits.map((s) => ({
              userId: Number(s.userId),
              amount: parseFloat(s.amount),
            }))
          : null,
    };

    try {
      let expenseId;
      if (editingExpense) {
        const response = await api.put(`/expenses/${editingExpense.id}`, payload);
        expenseId = response.data.id;
      } else {
        const response = await api.post('/expenses', payload);
        expenseId = response.data.id;
      }

      // Upload bill if provided
      if (billFile) {
        const fileFormData = new FormData();
        fileFormData.append('file', billFile);
        fileFormData.append('expenseId', expenseId);
        await api.post('/bills/upload', fileFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      setShowModal(false);
      resetForm();
      loadExpenses();
    } catch (err) {
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
        setError(err.response?.data?.message || 'Please correct the highlighted fields.');
      } else {
        setError(err.response?.data?.message || 'Failed to save expense. Please check your inputs.');
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    try {
      await api.delete(`/expenses/${id}`);
      loadExpenses();
    } catch (error) {
      console.error('Failed to delete expense:', error);
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      amount: expense.amount.toString(),
      description: expense.description,
      expenseDate: expense.expenseDate,
      categoryId: expense.categoryId?.toString() || '',
      splitType: expense.splitType,
      paidById: expense.paidById.toString(),
      splits:
        expense.splits?.map((s) => ({
          userId: s.userId.toString(),
          amount: s.amount.toString(),
        })) || [],
    });
    setFieldErrors({});
    setError('');
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      amount: '',
      description: '',
      expenseDate: new Date().toISOString().split('T')[0],
      categoryId: '',
      splitType: 'EQUAL',
      paidById: members[0]?.userId?.toString() || '',
      splits: [],
    });
    setEditingExpense(null);
    setError('');
    setFieldErrors({});
    setBillFile(null);
    setBillPreview(null);
  };

  const handleBillChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBillFile(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setBillPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setBillPreview(null);
      }
    }
  };

  const handleViewBill = (expenseId) => {
    window.open(`${process.env.REACT_APP_API_URL || 'http://localhost:8081/api'}/bills/${expenseId}`, '_blank');
  };

  const updateSplit = (index, field, value) => {
    const newSplits = [...formData.splits];
    newSplits[index] = { ...newSplits[index], [field]: value };
    setFormData((prev) => ({ ...prev, splits: newSplits }));

    // Clear individual split row errors upon user editing
    if (fieldErrors.splitRows && fieldErrors.splitRows[index] && fieldErrors.splitRows[index][field]) {
      setFieldErrors((prev) => {
        const updatedRows = [...(prev.splitRows || [])];
        if (updatedRows[index]) {
          updatedRows[index] = { ...updatedRows[index] };
          delete updatedRows[index][field];
        }
        return { ...prev, splitRows: updatedRows, splits: undefined };
      });
    } else if (fieldErrors.splits) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next.splits;
        return next;
      });
    }
  };

  const addSplit = () => {
    setFormData((prev) => ({
      ...prev,
      splits: [...prev.splits, { userId: '', amount: '' }],
    }));
  };

  const removeSplit = (index) => {
    setFormData((prev) => ({
      ...prev,
      splits: prev.splits.filter((_, i) => i !== index),
    }));
    if (fieldErrors.splitRows && fieldErrors.splitRows[index]) {
      setFieldErrors((prev) => ({
        ...prev,
        splitRows: (prev.splitRows || []).filter((_, i) => i !== index),
        splits: undefined,
      }));
    }
  };

  // Helper calculation for custom splits
  const customSplitsTotal =
    formData.splitType === 'CUSTOM'
      ? formData.splits.reduce((acc, s) => {
          const val = parseFloat(s.amount);
          return acc + (!isNaN(val) && val > 0 ? Math.round(val * 100) : 0);
        }, 0) / 100
      : 0;
  const expenseAmountNum = parseFloat(formData.amount);
  const totalExpenseVal = !isNaN(expenseAmountNum) && expenseAmountNum > 0 ? expenseAmountNum : 0;
  const splitDifference = (totalExpenseVal - customSplitsTotal).toFixed(2);

  // Filter expenses by search term and selected category
  const filteredExpenses = expenses.filter((exp) => {
    const matchSearch =
      exp.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.paidByFullName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat =
      selectedCategoryFilter === 'ALL' ||
      (exp.categoryName && exp.categoryName.toUpperCase() === selectedCategoryFilter.toUpperCase());
    return matchSearch && matchCat;
  });

  // Category badge color helper
  const getCategoryTheme = (categoryName) => {
    const lower = (categoryName || '').toLowerCase();
    if (lower.includes('food') || lower.includes('grocer')) {
      return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' };
    }
    if (lower.includes('util') || lower.includes('bill') || lower.includes('wifi')) {
      return { bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' };
    }
    if (lower.includes('rent')) {
      return { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', dot: 'bg-indigo-500' };
    }
    if (lower.includes('shop')) {
      return { bg: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' };
    }
    if (lower.includes('entertain')) {
      return { bg: 'bg-sky-50 text-sky-700 border-sky-200', dot: 'bg-sky-500' };
    }
    return { bg: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-400' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-3 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-500">Loading expenses...</p>
        </div>
      </div>
    );
  }

  if (!roomId) {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <p className="text-slate-500 text-sm">Please select a room to view expenses.</p>
      </div>
    );
  }

  const currentRoom = rooms.find((r) => r.id === Number(roomId));

  return (
    <div className="space-y-7 animate-fade-in pb-12">
      {/* 1. Top Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-coral-500 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100 inline-block mb-1.5">
            Ledger & Receipts
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <span>Expenses</span>
            <span className="text-xl">💳</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Track, split, and attach bills for every shared transaction.
          </p>
        </div>

        {/* Room Selector & Add Expense Button */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <select
              value={roomId}
              onChange={(e) => {
                const selected = e.target.value;
                setRoomId(selected);
                setSearchParams({ roomId: selected }, { replace: true });
              }}
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

          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center space-x-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-soft transition"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* 2. Filter & Search Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-[#EAE8E3] shadow-soft">
        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <SearchIcon className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search description, payer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs">
          <button
            onClick={() => setSelectedCategoryFilter('ALL')}
            className={`px-3 py-1 rounded-lg font-semibold transition shrink-0 ${
              selectedCategoryFilter === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryFilter(cat.name)}
              className={`px-3 py-1 rounded-lg font-semibold transition shrink-0 ${
                selectedCategoryFilter === cat.name
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Expense List */}
      <div className="bg-white rounded-3xl border border-[#EAE8E3] shadow-soft overflow-hidden">
        {filteredExpenses.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filteredExpenses.map((expense) => {
              const theme = getCategoryTheme(expense.categoryName);
              const initials = (expense.paidByFullName || 'User')
                .split(' ')
                .map((n) => n[0])
                .join('')
                .substring(0, 2)
                .toUpperCase();

              return (
                <div
                  key={expense.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition"
                >
                  {/* Left: Category Badge & Details */}
                  <div className="flex items-start sm:items-center space-x-3.5">
                    {/* Category icon container */}
                    <div className="w-11 h-11 rounded-2xl bg-cream-200 text-slate-700 flex items-center justify-center shrink-0 border border-[#EAE8E3]">
                      <ReceiptIcon className="w-5 h-5 text-slate-700" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm sm:text-base text-slate-900">
                          {expense.description}
                        </span>
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${theme.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${theme.dot}`}></span>
                          <span>{expense.categoryName || 'General'}</span>
                        </span>

                        {expense.hasBill && (
                          <button
                            onClick={() => handleViewBill(expense.id)}
                            className="inline-flex items-center space-x-1 text-xs font-semibold text-sky-600 hover:text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100 transition"
                            title="View attached bill receipt"
                          >
                            <span>📄 Bill</span>
                          </button>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 text-xs text-slate-500">
                        <div className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[9px] font-bold">
                          {initials}
                        </div>
                        <span>Paid by <strong>{expense.paidByFullName}</strong></span>
                        <span>•</span>
                        <span>{expense.expenseDate}</span>
                        {expense.splitType === 'CUSTOM' && (
                          <>
                            <span>•</span>
                            <span className="text-amber-600 font-semibold">Custom Split</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Amount & Actions */}
                  <div className="flex items-center justify-between sm:justify-end space-x-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                      ${parseFloat(expense.amount).toFixed(2)}
                    </span>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
                        title="Edit expense"
                      >
                        <EditIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                        title="Delete expense"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center text-slate-400 text-xs">
            No expenses found matching your criteria.
          </div>
        )}
      </div>

      {/* 4. Add / Edit Expense Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-card border border-[#EAE8E3] p-6 sm:p-8 my-8 animate-fade-in">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  {editingExpense ? 'Edit Expense' : 'Add New Expense'}
                </h3>
                <p className="text-xs text-slate-400">
                  Record shared payment for {currentRoom?.name || 'this space'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
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

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Row 1: Amount & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Amount ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    className={`w-full px-3.5 py-2.5 border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 ${
                      fieldErrors.amount
                        ? 'border-rose-400 bg-rose-50/40 focus:ring-rose-500'
                        : 'border-slate-200 focus:ring-slate-300'
                    }`}
                    value={formData.amount}
                    onChange={(e) => handleFieldChange('amount', e.target.value)}
                  />
                  {fieldErrors.amount && (
                    <p className="mt-1 text-xs text-rose-600 font-medium">{fieldErrors.amount}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Date *
                  </label>
                  <input
                    type="date"
                    className={`w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 ${
                      fieldErrors.expenseDate
                        ? 'border-rose-400 bg-rose-50/40 focus:ring-rose-500'
                        : 'border-slate-200 focus:ring-slate-300'
                    }`}
                    value={formData.expenseDate}
                    onChange={(e) => handleFieldChange('expenseDate', e.target.value)}
                  />
                  {fieldErrors.expenseDate && (
                    <p className="mt-1 text-xs text-rose-600 font-medium">{fieldErrors.expenseDate}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Description *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Monthly Wi-Fi bill, Trader Joe's groceries"
                  className={`w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 ${
                    fieldErrors.description
                      ? 'border-rose-400 bg-rose-50/40 focus:ring-rose-500'
                      : 'border-slate-200 focus:ring-slate-300'
                  }`}
                  value={formData.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                />
                {fieldErrors.description && (
                  <p className="mt-1 text-xs text-rose-600 font-medium">{fieldErrors.description}</p>
                )}
              </div>

              {/* Row 2: Category & Paid By */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Category
                  </label>
                  <select
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 bg-white"
                    value={formData.categoryId}
                    onChange={(e) => handleFieldChange('categoryId', e.target.value)}
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Paid By *
                  </label>
                  <select
                    className={`w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 bg-white ${
                      fieldErrors.paidById
                        ? 'border-rose-400 bg-rose-50/40 focus:ring-rose-500'
                        : 'border-slate-200 focus:ring-slate-300'
                    }`}
                    value={formData.paidById}
                    onChange={(e) => handleFieldChange('paidById', e.target.value)}
                  >
                    <option value="">Select member</option>
                    {members.map((member) => (
                      <option key={member.userId} value={member.userId}>
                        {member.fullName}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.paidById && (
                    <p className="mt-1 text-xs text-rose-600 font-medium">{fieldErrors.paidById}</p>
                  )}
                </div>
              </div>

              {/* Split Type Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Split Strategy *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleFieldChange('splitType', 'EQUAL')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition text-center ${
                      formData.splitType === 'EQUAL'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-soft'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Equal Split
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFieldChange('splitType', 'CUSTOM')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition text-center ${
                      formData.splitType === 'CUSTOM'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-soft'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Custom Split
                  </button>
                </div>
              </div>

              {/* Custom Split Builder */}
              {formData.splitType === 'CUSTOM' && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-800">Custom Splits *</span>
                    <button
                      type="button"
                      onClick={addSplit}
                      className="text-xs font-bold text-sky-600 hover:text-sky-700"
                    >
                      + Add Member
                    </button>
                  </div>

                  {/* Balance Calculator Indicator */}
                  <div className="flex justify-between items-center text-xs py-2 px-3 rounded-xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-slate-600">
                      Allocated: <strong>${customSplitsTotal.toFixed(2)}</strong> / ${totalExpenseVal.toFixed(2)}
                    </span>
                    <span
                      className={`font-bold ${
                        splitDifference === '0.00'
                          ? 'text-emerald-600'
                          : splitDifference > 0
                          ? 'text-amber-600'
                          : 'text-rose-600'
                      }`}
                    >
                      {splitDifference === '0.00'
                        ? '✓ Balanced'
                        : splitDifference > 0
                        ? `+$${splitDifference} remaining`
                        : `-$${Math.abs(splitDifference).toFixed(2)} over limit`}
                    </span>
                  </div>

                  {fieldErrors.splits && (
                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                      {fieldErrors.splits}
                    </div>
                  )}

                  {formData.splits.map((split, index) => {
                    const rowErr = fieldErrors.splitRows && fieldErrors.splitRows[index];
                    return (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1">
                            <select
                              className={`w-full px-3 py-2 border rounded-xl text-xs bg-white ${
                                rowErr?.userId ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200'
                              }`}
                              value={split.userId}
                              onChange={(e) => updateSplit(index, 'userId', e.target.value)}
                            >
                              <option value="">Select member</option>
                              {members.map((member) => (
                                <option key={member.userId} value={member.userId}>
                                  {member.fullName}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="flex-1">
                            <input
                              type="number"
                              step="0.01"
                              min="0.01"
                              placeholder="Amount ($)"
                              className={`w-full px-3 py-2 border rounded-xl text-xs ${
                                rowErr?.amount ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200'
                              }`}
                              value={split.amount}
                              onChange={(e) => updateSplit(index, 'amount', e.target.value)}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSplit(index)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                            title="Remove split"
                          >
                            ✕
                          </button>
                        </div>
                        {(rowErr?.userId || rowErr?.amount) && (
                          <div className="flex space-x-2 px-1">
                            <p className="flex-1 text-[11px] text-rose-600 font-medium">{rowErr?.userId || ''}</p>
                            <p className="flex-1 text-[11px] text-rose-600 font-medium">{rowErr?.amount || ''}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Bill / Receipt File Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Bill / Receipt (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                  onChange={handleBillChange}
                />
                {billPreview && (
                  <div className="mt-3">
                    <img
                      src={billPreview}
                      alt="Receipt preview"
                      className="max-h-36 rounded-xl border border-slate-200 shadow-soft"
                    />
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-soft"
                >
                  {editingExpense ? 'Update Expense' : 'Create Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
