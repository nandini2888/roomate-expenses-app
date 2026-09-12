import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AppLogo,
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  ArrowRightIcon,
} from '../components/Icons';
import { AuthHeroArtwork } from '../components/Artwork';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = (trimmedEmail, trimmedPassword) => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedEmail) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(trimmedEmail)) {
      errors.email = 'Please provide a valid email address';
    }

    if (!trimmedPassword) {
      errors.password = 'Password is required';
    } else if (trimmedPassword.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    const clientErrors = validate(trimmedEmail, trimmedPassword);
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      return;
    }

    setLoading(true);

    try {
      await login(trimmedEmail, trimmedPassword);
      navigate('/dashboard');
    } catch (err) {
      if (!err.response) {
        setError('Unable to connect to the server. Please check your internet connection or try again later.');
      } else if (err.response.data?.errors) {
        setFieldErrors(err.response.data.errors);
        setError(err.response.data.message || 'Please correct the errors below.');
      } else if (err.response.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (fieldErrors.email) {
      setFieldErrors((prev) => ({ ...prev, email: '' }));
    }
    if (error) setError('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (fieldErrors.password) {
      setFieldErrors((prev) => ({ ...prev, password: '' }));
    }
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-between p-4 sm:p-6 lg:p-8 selection:bg-rose-100 selection:text-rose-900 font-sans">
      {/* Top Header Bar */}
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between py-2 mb-4">
        <div className="flex items-center space-x-3">
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

        <div className="hidden sm:block">
          <span className="font-serif italic text-sm text-slate-500 font-medium">
            Good People Share Great Stories ♡
          </span>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center flex-1 my-auto py-4">
        {/* Left Column: Editorial Value Proposition & Storytelling */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-4 max-w-xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
              Better Roommates <br />
              <span className="font-serif italic font-normal text-coral-500">Happier Days.</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
              Track, share and settle expenses without the awkward maths.
            </p>
          </div>

          {/* Value Pillars */}
          <div className="space-y-3.5 max-w-md">
            <div className="flex items-center space-x-3.5 p-2 rounded-2xl transition hover:bg-white/60">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 shadow-xs">
                🌸
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Track together</h3>
                <p className="text-xs text-slate-500">Keep everything transparent</p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 p-2 rounded-2xl transition hover:bg-white/60">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 shadow-xs">
                ⚡
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Split fairly</h3>
                <p className="text-xs text-slate-500">No more confusion</p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 p-2 rounded-2xl transition hover:bg-white/60">
              <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center shrink-0 shadow-xs">
                💙
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Focus on what matters</h3>
                <p className="text-xs text-slate-500">More time for the good stuff</p>
              </div>
            </div>
          </div>

          {/* Bespoke Story Artwork Card */}
          <div className="rounded-3xl overflow-hidden border border-[#EAE8E3] bg-white shadow-soft max-w-xl">
            <AuthHeroArtwork className="w-full h-auto" />
          </div>

          <p className="text-xs font-medium text-slate-400">
            Same space. Better together.
          </p>
        </div>

        {/* Right Column: Elevated Login Card */}
        <div className="lg:col-span-5 w-full max-w-md mx-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE8E3] shadow-float">
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-1.5">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back</h2>
                <span className="text-xl">👋</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Sign in to continue your journey
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Email field */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <MailIcon className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border ${
                      fieldErrors.email
                        ? 'border-rose-400 bg-rose-50/40 focus:ring-rose-500'
                        : 'border-slate-200 bg-white focus:border-slate-400 focus:ring-slate-300'
                    } placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 transition`}
                    placeholder="name@example.com"
                    value={email}
                    onChange={handleEmailChange}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="mt-1 text-xs text-rose-600 font-medium">{fieldErrors.email}</p>
                )}
              </div>

              {/* Password field */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <LockIcon className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    className={`w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border ${
                      fieldErrors.password
                        ? 'border-rose-400 bg-rose-50/40 focus:ring-rose-500'
                        : 'border-slate-200 bg-white focus:border-slate-400 focus:ring-slate-300'
                    } placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 transition`}
                    placeholder="••••••••"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="mt-1 text-xs text-rose-600 font-medium">{fieldErrors.password}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 shadow-sm disabled:opacity-50 transition"
              >
                <span>{loading ? 'Signing in...' : 'Sign in'}</span>
                {!loading && <ArrowRightIcon className="w-4 h-4" />}
              </button>

              {/* Sign up Link */}
              <div className="text-center pt-3">
                <p className="text-xs text-slate-500">
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    className="font-bold text-sky-600 hover:text-sky-700 transition"
                  >
                    Create one
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
