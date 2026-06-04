import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStorefront } from '../context/StorefrontContext';
import { Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff } from 'lucide-react';

export function Login() {
  const router = useRouter();
  const { login, register, isLoggedIn } = useStorefront();
  const [isLoginView, setIsLoginView] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  React.useEffect(() => {
    if (isLoggedIn) {
      router.push('/dashboard');
    }
  }, [isLoggedIn, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLoginView) {
        if (!email || !password) {
          setError('Please fill in all fields.');
          setIsLoading(false);
          return;
        }
        await login(email);
      } else {
        if (!name || !email || !phone || !password) {
          setError('Please fill in all fields.');
          setIsLoading(false);
          return;
        }
        await register(name, email, phone);
      }
      router.push('/dashboard');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-140px)] flex bg-[#FAF6F0]">
      {/* Left side Graphic - Hidden on Mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#3D2817] text-white p-12 flex-col justify-between overflow-hidden">
        {/* Background Decorative patterns */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#8B5A3C] rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#D4A574] rounded-full mix-blend-multiply filter blur-3xl opacity-15 -translate-x-1/2 translate-y-1/2"></div>

        <div className="relative z-10">
          <span className="text-sm font-bold tracking-widest text-[#D4A574] uppercase">Lumière & Knit</span>
        </div>

        <div className="relative z-10 my-auto space-y-6 max-w-md">
          <h1 className="text-4xl xl:text-5xl font-bold leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
            Elevate Your Everyday Style
          </h1>
          <p className="text-gray-300 text-base leading-relaxed">
            Join our exclusive membership to unlock early product drops, earn double loyalty points on gold selections, and experience bespoke sizing guides tailored to you.
          </p>
        </div>

        <div className="relative z-10 flex gap-12 text-sm text-gray-400">
          <div>
            <span className="block font-bold text-white text-lg">100%</span>
            <span>Premium Materials</span>
          </div>
          <div>
            <span className="block font-bold text-white text-lg">50k+</span>
            <span>Happy Customers</span>
          </div>
          <div>
            <span className="block font-bold text-white text-lg">Free</span>
            <span>US Returns</span>
          </div>
        </div>
      </div>

      {/* Right side Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16">
        <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl border border-gray-100 transition-all duration-300 hover:shadow-2xl">
          
          {/* Tabs */}
          <div className="flex border-b border-gray-100 mb-8">
            <button
              onClick={() => { setIsLoginView(true); setError(''); }}
              className={`flex-1 pb-4 text-sm font-bold transition-all relative ${
                isLoginView ? 'text-[#8B5A3C]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Sign In
              {isLoginView && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8B5A3C] rounded-full animate-pulse" />}
            </button>
            <button
              onClick={() => { setIsLoginView(false); setError(''); }}
              className={`flex-1 pb-4 text-sm font-bold transition-all relative ${
                !isLoginView ? 'text-[#8B5A3C]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Register
              {!isLoginView && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8B5A3C] rounded-full animate-pulse" />}
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#3D2817]" style={{ fontFamily: 'Playfair Display, serif' }}>
              {isLoginView ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {isLoginView ? 'Access your orders, rewards and profile.' : 'Get welcome rewards and custom sizing advice.'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginView && (
              <>
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5A3C] focus:border-[#8B5A3C] transition-all"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5A3C] focus:border-[#8B5A3C] transition-all"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="jane.doe@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5A3C] focus:border-[#8B5A3C] transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Password</label>
                {isLoginView && (
                  <a href="#" className="text-xs font-bold text-[#8B5A3C] hover:underline">Forgot?</a>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5A3C] focus:border-[#8B5A3C] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#8B5A3C] hover:bg-[#6F4630] disabled:bg-gray-400 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all mt-6 shadow-md hover:shadow-lg"
            >
              {isLoading ? 'Processing...' : isLoginView ? 'Sign In' : 'Create Account'}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
