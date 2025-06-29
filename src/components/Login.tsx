import React, { useState } from 'react';
import { User, LogIn, Mail, Lock, Star, Heart } from 'lucide-react';
import { authService } from '../utils/auth';

interface LoginProps {
  onLogin: (user: any) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('🔄 Attempting login with:', email);
      const user = await authService.login(email, password);
      if (user) {
        console.log('✅ Login successful, calling onLogin');
        onLogin(user);
      } else {
        console.log('❌ Login failed - invalid credentials');
        setError('Oops! Those details don\'t match. Try the demo buttons below! 😊');
      }
    } catch (err) {
      console.error('❌ Login error:', err);
      setError('Something went wrong. Let\'s try again! 🌟');
    } finally {
      setIsLoading(false);
    }
  };

  const useDemoCredentials = (userType: 'admin' | 'student') => {
    console.log('🎮 Using demo credentials for:', userType);
    if (userType === 'admin') {
      setEmail('admin@tastenotwaste.demo');
      setPassword('demo2024');
    } else {
      setEmail('student@tastenotwaste.demo');
      setPassword('demo2024');
    }
    setError(''); // Clear any existing errors
  };

  const handleDemoLogin = async (userType: 'admin' | 'student') => {
    console.log('🚀 Direct demo login for:', userType);
    setIsLoading(true);
    setError('');

    try {
      const demoEmail = userType === 'admin' ? 'admin@tastenotwaste.demo' : 'student@tastenotwaste.demo';
      const user = await authService.login(demoEmail, 'demo2024');
      
      if (user) {
        console.log('✅ Demo login successful');
        onLogin(user);
      } else {
        console.log('❌ Demo login failed');
        setError('Demo login failed. Please try again! 🔄');
      }
    } catch (err) {
      console.error('❌ Demo login error:', err);
      setError('Demo login error. Please try again! 🔄');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-50 to-pink-100 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-4xl animate-bounce opacity-60">🍎</div>
        <div className="absolute top-20 right-20 text-3xl animate-pulse opacity-60">🥕</div>
        <div className="absolute bottom-20 left-20 text-3xl animate-bounce delay-1000 opacity-60">🍌</div>
        <div className="absolute bottom-10 right-10 text-4xl animate-pulse delay-500 opacity-60">🥗</div>
        <div className="absolute top-1/2 left-5 text-2xl animate-bounce delay-700 opacity-60">🍇</div>
        <div className="absolute top-1/3 right-5 text-2xl animate-pulse delay-300 opacity-60">🥪</div>
        <div className="absolute top-1/4 left-1/4 text-2xl animate-bounce delay-200 opacity-40">⭐</div>
        <div className="absolute bottom-1/4 right-1/4 text-2xl animate-pulse delay-800 opacity-40">🌟</div>
      </div>

      <div className="flex items-center justify-center min-h-screen p-4 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border-4 border-yellow-300 relative">
          {/* Welcome message */}
          {showWelcome && (
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-white px-6 py-2 rounded-full text-sm font-bold animate-bounce border-2 border-white shadow-lg">
              Welcome back, friend! 👋
            </div>
          )}

          {/* Main logo and mascot */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              {/* Main emoji character - Updated path for production */}
              <img 
                src="/mascot.png" 
                alt="Taste Not Waste Mascot" 
                className="w-24 h-24 mx-auto mb-4 animate-bounce hover:scale-110 transition-transform cursor-pointer"
                onClick={() => setShowWelcome(!showWelcome)}
                onError={(e) => {
                  // Fallback to emoji if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = document.createElement('div');
                  fallback.className = 'w-24 h-24 mx-auto mb-4 animate-bounce hover:scale-110 transition-transform cursor-pointer text-6xl flex items-center justify-center';
                  fallback.textContent = '😋';
                  target.parentNode?.insertBefore(fallback, target);
                }}
              />
              {/* Sparkle effects around the mascot */}
              <div className="absolute -top-2 -right-2 text-2xl animate-pulse">✨</div>
              <div className="absolute -bottom-2 -left-2 text-2xl animate-pulse delay-500">⭐</div>
            </div>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent mb-2 font-comic">
              Taste Not Waste
            </h1>
            <p className="text-lg text-gray-600 font-medium">
              Let's save food together! 🌍💚
            </p>
            <div className="flex justify-center gap-2 mt-2">
              <Heart className="w-5 h-5 text-pink-500 animate-pulse" />
              <Star className="w-5 h-5 text-yellow-500 animate-pulse delay-300" />
              <Heart className="w-5 h-5 text-pink-500 animate-pulse delay-600" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-500" />
                Your Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 text-lg border-3 border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all hover:border-blue-400 bg-blue-50"
                placeholder="Type your email here... 📧"
                required
                aria-describedby="email-help"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
                <Lock className="w-5 h-5 text-green-500" />
                Your Secret Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 text-lg border-3 border-gray-300 rounded-2xl focus:ring-4 focus:ring-green-300 focus:border-green-500 transition-all hover:border-green-400 bg-green-50"
                placeholder="Enter your password... 🔐"
                required
                aria-describedby="password-help"
              />
            </div>

            {error && (
              <div className="bg-red-100 border-3 border-red-300 rounded-2xl p-4 flex items-center gap-3">
                <div className="text-2xl">😅</div>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 px-6 rounded-2xl text-xl font-bold hover:scale-105 focus:ring-4 focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg border-2 border-white flex items-center justify-center gap-3"
              aria-describedby="login-button-help"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-3 border-white"></div>
                  <span>Getting ready...</span>
                  <div className="text-2xl">🌟</div>
                </>
              ) : (
                <>
                  <LogIn className="w-6 h-6" />
                  <span>Let's Go!</span>
                  <div className="text-2xl">🚀</div>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t-3 border-gray-200">
            <div className="text-center mb-4">
              <p className="text-lg font-bold text-gray-700 mb-2">Try Our Demo! 🎮</p>
              <p className="text-sm text-gray-600">Click a button to explore:</p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => handleDemoLogin('admin')}
                disabled={isLoading}
                className="w-full text-left p-4 bg-gradient-to-r from-purple-200 to-pink-200 rounded-2xl hover:scale-105 transition-all border-3 border-purple-300 hover:border-purple-400 shadow-lg disabled:opacity-50"
                aria-label="Login as admin demo user"
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">👩‍🏫</div>
                  <div>
                    <p className="text-lg font-bold text-purple-800">Teacher/Admin Mode</p>
                    <p className="text-sm text-purple-600">Manage menus and see reports</p>
                    <p className="text-xs text-purple-500 mt-1">📧 admin@tastenotwaste.demo</p>
                  </div>
                  <div className="ml-auto text-2xl animate-pulse">⭐</div>
                </div>
              </button>
              
              <button
                onClick={() => handleDemoLogin('student')}
                disabled={isLoading}
                className="w-full text-left p-4 bg-gradient-to-r from-green-200 to-blue-200 rounded-2xl hover:scale-105 transition-all border-3 border-green-300 hover:border-green-400 shadow-lg disabled:opacity-50"
                aria-label="Login as student demo user"
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">🧒</div>
                  <div>
                    <p className="text-lg font-bold text-green-800">Student Mode</p>
                    <p className="text-sm text-green-600">Pick meals and track your progress</p>
                    <p className="text-xs text-green-500 mt-1">📧 student@tastenotwaste.demo</p>
                  </div>
                  <div className="ml-auto text-2xl animate-pulse">🌟</div>
                </div>
              </button>

              {/* Alternative credential fill buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => useDemoCredentials('admin')}
                  className="flex-1 p-2 bg-purple-100 text-purple-700 rounded-xl text-sm font-bold hover:bg-purple-200 transition-colors"
                >
                  Fill Admin Info
                </button>
                <button
                  onClick={() => useDemoCredentials('student')}
                  className="flex-1 p-2 bg-green-100 text-green-700 rounded-xl text-sm font-bold hover:bg-green-200 transition-colors"
                >
                  Fill Student Info
                </button>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-yellow-100 rounded-2xl border-2 border-yellow-300">
              <p className="text-center text-sm font-bold text-yellow-800">
                🔑 Password for both: <span className="font-mono">demo2024</span>
              </p>
            </div>
          </div>

          {/* Fun footer message */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 animate-pulse" />
              <span>for kids who care about our planet!</span>
              <div className="text-lg">🌍</div>
            </p>
          </div>

          {/* Floating helper */}
          <div className="absolute -bottom-4 -right-4 bg-yellow-400 rounded-full p-3 shadow-xl border-3 border-white animate-bounce cursor-pointer hover:scale-110 transition-transform">
            <div className="text-2xl">🤗</div>
          </div>
        </div>
      </div>

      {/* Additional floating elements for more fun */}
      <div className="fixed bottom-4 left-4 text-3xl animate-bounce opacity-70">🎈</div>
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 text-2xl animate-pulse opacity-60">🌈</div>
    </div>
  );
};