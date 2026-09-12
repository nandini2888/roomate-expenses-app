import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AppLogo,
  DashboardIcon,
  RoomsIcon,
  SummaryIcon,
  ExpensesIcon,
  SettingsIcon,
  HelpIcon,
  SearchIcon,
  BellIcon,
  LogoutIcon,
  MenuIcon,
  CloseIcon,
} from './Icons';

const AppLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Keyboard shortcut Ctrl+K / Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setSearchOpen(false);
        setNotificationsOpen(false);
        setShowSettingsModal(false);
        setShowHelpModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: DashboardIcon },
    { name: 'Rooms', path: '/rooms', icon: RoomsIcon },
    { name: 'Expenses', path: '/expenses', icon: ExpensesIcon },
    { name: 'Summary', path: '/summary', icon: SummaryIcon },
  ];

  // Helper for deterministic user initials & avatar background
  const userInitials = (user?.fullName || user?.username || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col md:flex-row text-slate-900 font-sans">
      {/* 1. Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#FAF9F6] border-r border-[#EAE8E3] px-5 py-6 shrink-0 justify-between">
        {/* Brand Header */}
        <div>
          <div className="flex items-center space-x-3 mb-8 px-2">
            <AppLogo className="w-9 h-9" />
            <div>
              <span className="font-bold text-base tracking-tight text-slate-900 block leading-tight">
                Sharing is Caring
              </span>
              <span className="text-[11px] font-medium text-slate-400 block tracking-wide">
                Live together. Share better.
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <span className={isActive ? 'text-primary-600' : 'text-slate-400'}>
                    <Icon className="w-5 h-5" />
                  </span>
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Settings, Help & User Profile */}
        <div className="space-y-4 pt-4 border-t border-[#EAE8E3]">
          <div className="space-y-1">
            <button
              onClick={() => setShowSettingsModal(true)}
              className="w-full flex items-center space-x-3.5 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white/60 text-left transition"
            >
              <SettingsIcon className="w-5 h-5 text-slate-400" />
              <span>Settings</span>
            </button>
            <button
              onClick={() => setShowHelpModal(true)}
              className="w-full flex items-center space-x-3.5 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white/60 text-left transition"
            >
              <HelpIcon className="w-5 h-5 text-slate-400" />
              <span>Help & Guide</span>
            </button>
          </div>

          {/* User Profile Card */}
          {user && (
            <div className="pt-2">
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white border border-[#EAE8E3] shadow-soft">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
                    {userInitials}
                  </div>
                  <div className="min-w-0 truncate">
                    <p className="text-xs font-bold text-slate-900 truncate leading-snug">
                      {user.fullName || user.username}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {user.email || 'Roommate'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  title="Log out"
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition shrink-0"
                >
                  <LogoutIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 px-4 sm:px-8 border-b border-[#EAE8E3] bg-[#FAF9F6]/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
          {/* Mobile Menu Toggle & Brand */}
          <div className="flex items-center space-x-3 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-2">
              <AppLogo className="w-7 h-7" />
              <span className="font-bold text-sm text-slate-900">Sharing is Caring</span>
            </div>
          </div>

          {/* Desktop Search Bar (Ctrl+K) */}
          <div className="hidden md:flex items-center flex-1 max-w-md mr-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full flex items-center justify-between px-4 py-2 text-sm bg-white border border-[#EAE8E3] hover:border-slate-300 rounded-full text-slate-400 shadow-soft transition-all"
            >
              <span className="flex items-center space-x-2.5">
                <SearchIcon className="w-4 h-4 text-slate-400" />
                <span>Search expenses, rooms, or people...</span>
              </span>
              <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 rounded-md">
                Ctrl K
              </kbd>
            </button>
          </div>

          {/* Header Right Actions: Notifications & Avatar */}
          <div className="flex items-center space-x-3 ml-auto">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen((prev) => !prev)}
                className="relative p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-white border border-transparent hover:border-[#EAE8E3] transition"
                title="Notifications"
              >
                <BellIcon className="w-5 h-5" />
              </button>

              {/* Notification Popover */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-card border border-[#EAE8E3] p-4 z-50 animate-fade-in">
                  <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 mb-2.5">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Notifications
                    </h4>
                  </div>
                  <div className="py-6 text-center text-xs text-slate-400">
                    <p className="font-semibold text-slate-600">All caught up!</p>
                    <p className="text-[11px] mt-0.5">No new notifications for your shared spaces.</p>
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar Circle */}
            {user && (
              <div className="flex items-center space-x-2 pl-2">
                <div
                  className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-soft cursor-pointer hover:ring-2 hover:ring-slate-300 transition"
                  title={user.fullName || user.username}
                  onClick={() => setShowSettingsModal(true)}
                >
                  {userInitials}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* 3. Page Content Area */}
        <main className="flex-1 px-4 sm:px-8 py-6 max-w-7xl w-full mx-auto animate-fade-in">
          {children}
        </main>
      </div>

      {/* 4. Mobile Sliding Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[80%] bg-[#FAF9F6] h-full shadow-2xl flex flex-col justify-between p-6 z-50">
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <AppLogo className="w-8 h-8" />
                  <span className="font-bold text-base text-slate-900">Sharing is Caring</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname.startsWith(item.path);
                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      className={`flex items-center space-x-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                        isActive
                          ? 'bg-white text-slate-900 shadow-soft border border-slate-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : 'text-slate-400'}`} />
                      <span>{item.name}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            {user && (
              <div className="pt-4 border-t border-[#EAE8E3]">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#EAE8E3]">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {userInitials}
                    </div>
                    <div className="min-w-0 truncate">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {user.fullName || user.username}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 text-slate-400 hover:text-rose-600"
                  >
                    <LogoutIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. Global Search Modal (Ctrl+K) */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/30 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-card border border-[#EAE8E3] overflow-hidden animate-fade-in">
            <div className="flex items-center px-4 border-b border-slate-100">
              <SearchIcon className="w-5 h-5 text-slate-400 mr-3" />
              <input
                type="text"
                autoFocus
                placeholder="Type to search rooms, expenses, navigation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3.5 text-sm focus:outline-none text-slate-800 placeholder-slate-400"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 text-xs font-semibold"
              >
                ESC
              </button>
            </div>
            <div className="p-3 max-h-72 overflow-y-auto space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
                Quick Navigation
              </div>
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.path);
                    setSearchOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-xl text-slate-700 hover:bg-slate-50 hover:text-slate-900 text-left transition"
                >
                  <span className="flex items-center space-x-2.5">
                    <item.icon className="w-4 h-4 text-slate-400" />
                    <span>Go to {item.name}</span>
                  </span>
                  <span className="text-xs text-slate-400">{item.path}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-card border border-[#EAE8E3] p-6 animate-fade-in">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
                  <SettingsIcon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900">Account & Preferences</h3>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="p-4 rounded-2xl bg-cream-100 border border-[#EAE8E3]">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Signed in as</p>
                <p className="font-bold text-slate-900 text-base">{user?.fullName || user?.username}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Currency Display</label>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1.5 rounded-lg bg-slate-100 font-semibold text-xs text-slate-800">
                    $ (USD) / ₹ (INR) Supported
                  </span>
                  <span className="text-xs text-slate-400">Values format automatically based on input</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Color Theme</label>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-semibold text-xs">
                    Warm Editorial Canvas (Active)
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-card border border-[#EAE8E3] p-6 animate-fade-in">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
                  <HelpIcon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900">Sharing is Caring Guide</h3>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="font-bold text-slate-800 mb-0.5">1. Manage Rooms</p>
                <p>Create a room for your flat or shared apartment. Share the unique 8-character code with roommates to join.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="font-bold text-slate-800 mb-0.5">2. Record Expenses</p>
                <p>Add expenses with descriptions and upload receipt images. Choose equal splits or custom splits per member.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="font-bold text-slate-800 mb-0.5">3. Settle Up</p>
                <p>View real-time net balances on the Monthly Summary and settle debts with one click.</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppLayout;
