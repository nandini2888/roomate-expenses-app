import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppLogo, LogoutIcon } from './Icons';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-[#FAF9F6] border-b border-[#EAE8E3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2.5">
              <AppLogo className="w-8 h-8" />
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                Sharing is Caring
              </span>
            </Link>
            {user && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
                <Link
                  to="/dashboard"
                  className="px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-white"
                >
                  Dashboard
                </Link>
                <Link
                  to="/rooms"
                  className="px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-white"
                >
                  Rooms
                </Link>
                <Link
                  to="/expenses"
                  className="px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-white"
                >
                  Expenses
                </Link>
                <Link
                  to="/summary"
                  className="px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-white"
                >
                  Summary
                </Link>
              </div>
            )}
          </div>
          {user && (
            <div className="flex items-center space-x-3">
              <span className="text-sm font-semibold text-slate-800">
                {user.fullName || user.username}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
              >
                <LogoutIcon className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;



