import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';

const Expenses = () => {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('roomId');
  const [expenses, setExpenses] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
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
  const [billFile, setBillFile] = useState(null);
  const [billPreview, setBillPreview] = useState(null);

  useEffect(() => {
    loadRooms();
    loadCategories();
  }, []);

  useEffect(() => {
    if (roomId) {
      loadExpenses();
      loadMembers();
    }
  }, [roomId]);

  const loadRooms = async () => {
    try {
      const response = await api.get('/rooms');
      setRooms(response.data);
      if (!roomId && response.data.length > 0) {
        window.location.href = `/expenses?roomId=${response.data[0].id}`;
      }
    } catch (error) {
      console.error('Failed to load rooms:', error);
    }
  };

  const loadExpenses = async () => {
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
  };

  const loadMembers = async () => {
    if (!roomId) return;
    try {
      const response = await api.get(`/rooms/${roomId}/members`);
      setMembers(response.data);
      if (response.data.length > 0 && !formData.paidById) {
        setFormData({ ...formData, paidById: response.data[0].userId });
      }
    } catch (error) {
      console.error('Failed to load members:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const payload = {
      ...formData,
      roomId: Number(roomId),
      paidById: Number(formData.paidById),
      amount: parseFloat(formData.amount),
      categoryId: formData.categoryId ? Number(formData.categoryId) : null,
      splits: formData.splitType === 'CUSTOM' ? formData.splits.map(s => ({
        userId: Number(s.userId),
        amount: parseFloat(s.amount),
      })) : null,
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
        const formData = new FormData();
        formData.append('file', billFile);
        formData.append('expenseId', expenseId);
        await api.post('/bills/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      setShowModal(false);
      resetForm();
      loadExpenses();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save expense');
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
      splits: expense.splits?.map(s => ({
        userId: s.userId.toString(),
        amount: s.amount.toString(),
      })) || [],
    });
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
    window.open(`${process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}/bills/${expenseId}`, '_blank');
  };

  const updateSplit = (index, field, value) => {
    const newSplits = [...formData.splits];
    newSplits[index] = { ...newSplits[index], [field]: value };
    setFormData({ ...formData, splits: newSplits });
  };

  const addSplit = () => {
    setFormData({
      ...formData,
      splits: [...formData.splits, { userId: '', amount: '' }],
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!roomId) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-gray-600">Please select a room to view expenses.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
          <select
            value={roomId}
            onChange={(e) => window.location.href = `/expenses?roomId=${e.target.value}`}
            className="mt-2 block rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Add Expense
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {expenses.map((expense) => (
            <li key={expense.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-gray-900">
                      {expense.description}
                    </p>
                    <span className="ml-2 text-sm text-gray-500">
                      - {expense.categoryName || 'Uncategorized'}
                    </span>
                    {expense.hasBill && (
                      <button
                        onClick={() => handleViewBill(expense.id)}
                        className="ml-2 text-primary-600 hover:text-primary-700 text-sm"
                      >
                        📄 View Bill
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    Paid by {expense.paidByFullName} on {expense.expenseDate}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-lg font-semibold text-gray-900">
                    ${parseFloat(expense.amount).toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleEdit(expense)}
                    className="text-primary-600 hover:text-primary-700 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingExpense ? 'Edit Expense' : 'Add New Expense'}
            </h3>
            {error && (
              <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={formData.expenseDate}
                    onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Paid By *
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={formData.paidById}
                    onChange={(e) => setFormData({ ...formData, paidById: e.target.value })}
                  >
                    {members.map((member) => (
                      <option key={member.userId} value={member.userId}>
                        {member.fullName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Split Type *
                </label>
                <select
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={formData.splitType}
                  onChange={(e) => setFormData({ ...formData, splitType: e.target.value })}
                >
                  <option value="EQUAL">Equal Split</option>
                  <option value="CUSTOM">Custom Split</option>
                </select>
              </div>
              {formData.splitType === 'CUSTOM' && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Custom Splits *
                    </label>
                    <button
                      type="button"
                      onClick={addSplit}
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      + Add Split
                    </button>
                  </div>
                  {formData.splits.map((split, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4 mb-2">
                      <select
                        required
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
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
                      <input
                        type="number"
                        step="0.01"
                        required
                        placeholder="Amount"
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        value={split.amount}
                        onChange={(e) => updateSplit(index, 'amount', e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bill/Receipt (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  onChange={handleBillChange}
                />
                {billPreview && (
                  <div className="mt-2">
                    <img
                      src={billPreview}
                      alt="Bill preview"
                      className="max-w-xs h-auto rounded-md border border-gray-300"
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  {editingExpense ? 'Update' : 'Create'}
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

