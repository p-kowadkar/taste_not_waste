import React, { useState, useEffect } from 'react';
import { TrendingUp, Award, Calendar, Target, Star, Trophy, Heart, Zap, Gift, Users, ChevronDown, Settings, LogOut, User as UserIcon } from 'lucide-react';
import { User, StudentStats, WasteEntry, ClassSustainabilityMetrics, DietaryPreferences } from '../../types';
import { storageService } from '../../utils/storage';

interface DashboardProps {
  user: User;
  onLogout?: () => void;
  onUpdatePreferences?: (preferences: DietaryPreferences) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onUpdatePreferences }) => {
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [recentWaste, setRecentWaste] = useState<WasteEntry[]>([]);
  const [classMetrics, setClassMetrics] = useState<ClassSustainabilityMetrics | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [clickedCard, setClickedCard] = useState<string | null>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [preferences, setPreferences] = useState<DietaryPreferences>(
    user.dietaryPreferences || {
      vegetarian: false,
      vegan: false,
      kosher: false,
      halal: false,
      dairyFree: false,
      glutenFree: false,
      allergens: [],
      customRestrictions: []
    }
  );

  useEffect(() => {
    if (user.id) {
      const studentStats = storageService.getStudentStats(user.id);
      const wasteEntries = storageService.getWasteEntries(user.id);
      const metrics = storageService.getClassMetrics(user.school || 'default');
      
      setStats(studentStats);
      setRecentWaste(wasteEntries.slice(-5));
      setClassMetrics(metrics);
      
      // Show celebration for new achievements
      if (studentStats.achievements.length > 0) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }
    }
  }, [user.id, user.school]);

  const handleCardClick = (cardId: string) => {
    setClickedCard(cardId);
    setTimeout(() => setClickedCard(null), 200);
  };

  const handleSavePreferences = () => {
    if (onUpdatePreferences) {
      onUpdatePreferences(preferences);
    }
    storageService.updateUserPreferences(user.id, preferences);
    setShowPreferencesModal(false);
  };

  const handleAllergenChange = (allergen: string, checked: boolean) => {
    setPreferences(prev => ({
      ...prev,
      allergens: checked 
        ? [...prev.allergens, allergen]
        : prev.allergens.filter(a => a !== allergen)
    }));
  };

  if (!stats || !classMetrics) {
    return (
      <div className="p-6 min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🌟</div>
          <p className="text-2xl font-bold text-purple-600">Loading your adventure...</p>
        </div>
      </div>
    );
  }

  const levelProgress = ((stats.totalPoints % 100) / 100) * 100;
  const nextLevel = stats.level + 1;

  // Fun mascot messages based on performance
  const getMascotMessage = () => {
    if (stats.totalPoints > 200) return "Wow! You're a Food Hero! 🦸‍♀️";
    if (stats.totalPoints > 100) return "Amazing work, Food Champion! 🏆";
    if (stats.totalPoints > 50) return "You're doing great, Earth Helper! 🌍";
    return "Welcome to your food adventure! 🌟";
  };

  const getEncouragementMessage = () => {
    const messages = [
      "Every bite you finish helps our planet! 🌱",
      "You're making a real difference! ✨",
      "Keep up the awesome work! 🎉",
      "You're a waste-fighting superhero! 🦸‍♂️"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const commonAllergens = ['Peanuts', 'Tree Nuts', 'Milk', 'Eggs', 'Fish', 'Shellfish', 'Soy', 'Wheat'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-4xl animate-bounce">🌟</div>
        <div className="absolute top-20 right-20 text-3xl animate-pulse">🎈</div>
        <div className="absolute bottom-20 left-20 text-3xl animate-bounce delay-1000">🌈</div>
        <div className="absolute bottom-10 right-10 text-4xl animate-pulse delay-500">⭐</div>
        <div className="absolute top-1/2 left-5 text-2xl animate-bounce delay-700">🦋</div>
        <div className="absolute top-1/3 right-5 text-2xl animate-pulse delay-300">🌸</div>
      </div>

      {/* Profile Dropdown */}
      <div className="absolute top-4 right-4 z-30">
        <div className="relative">
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-3 bg-white rounded-full p-3 shadow-lg border-2 border-purple-300 hover:scale-105 transition-all"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
              {user.name.charAt(0)}
            </div>
            <span className="font-bold text-gray-800 hidden md:block">{user.name}</span>
            <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border-2 border-purple-300 overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-600">Grade {user.grade} • {user.school}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-2">
                <button
                  onClick={() => {
                    setShowPreferencesModal(true);
                    setShowProfileDropdown(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <Settings className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-800">Food Preferences</span>
                </button>
                
                <button
                  onClick={() => {
                    if (onLogout) onLogout();
                    setShowProfileDropdown(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-red-50 rounded-xl transition-colors text-red-600"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Celebration Animation */}
      {showCelebration && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="text-center animate-bounce">
            <div className="text-8xl mb-4">🎉</div>
            <div className="text-4xl font-bold text-yellow-600 bg-white px-6 py-3 rounded-full shadow-lg">
              Achievement Unlocked!
            </div>
          </div>
        </div>
      )}

      <div className="p-6 max-w-6xl mx-auto relative z-10">
        {/* Welcome Header with Mascot */}
        <div className="bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 rounded-3xl p-8 mb-8 shadow-xl border-4 border-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="text-8xl animate-bounce">🐻</div>
              <div>
                <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-2">
                  Hi there, {user.name}! 👋
                </h1>
                <p className="text-xl text-white drop-shadow-md font-medium">
                  {getMascotMessage()}
                </p>
                <p className="text-lg text-yellow-100 mt-2">
                  {getEncouragementMessage()}
                </p>
              </div>
            </div>
            <div className="text-6xl animate-pulse">🏆</div>
          </div>
        </div>

        {/* Class Sustainability Metrics */}
        <div className="bg-gradient-to-r from-green-200 via-blue-200 to-purple-200 rounded-3xl p-8 mb-8 shadow-xl border-4 border-white">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-5xl">🌍</div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Our Class is Saving the Planet!</h2>
              <p className="text-lg text-gray-700">Look how awesome we're doing together! 🎉</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-2xl p-6 border-3 border-green-300 shadow-lg">
              <div className="text-center">
                <div className="text-4xl mb-2">🎯</div>
                <div className="text-3xl font-bold text-green-600">{classMetrics.currentWasteReduction}%</div>
                <div className="text-sm text-gray-600">Waste Reduced</div>
                <div className="text-xs text-green-600 font-medium">Goal: {classMetrics.wasteReductionGoal}%</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border-3 border-blue-300 shadow-lg">
              <div className="text-center">
                <div className="text-4xl mb-2">👥</div>
                <div className="text-3xl font-bold text-blue-600">{classMetrics.participatingStudents}/{classMetrics.totalStudents}</div>
                <div className="text-sm text-gray-600">Friends Helping</div>
                <div className="text-xs text-blue-600 font-medium">Amazing teamwork!</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border-3 border-purple-300 shadow-lg">
              <div className="text-center">
                <div className="text-4xl mb-2">📈</div>
                <div className="text-3xl font-bold text-purple-600">{classMetrics.weeklyProgress}%</div>
                <div className="text-sm text-gray-600">This Week</div>
                <div className="text-xs text-purple-600 font-medium">Keep it up!</div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-2xl p-6 border-3 border-yellow-300">
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-bold text-gray-800">Class Progress to Goal</span>
              <span className="text-lg font-bold text-yellow-600">{Math.round((classMetrics.currentWasteReduction / classMetrics.wasteReductionGoal) * 100)}%</span>
            </div>
            <div className="bg-gray-200 rounded-full h-6 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 h-6 rounded-full transition-all duration-1000 relative"
                style={{ width: `${Math.min((classMetrics.currentWasteReduction / classMetrics.wasteReductionGoal) * 100, 100)}%` }}
              >
                <div className="absolute inset-0 bg-white bg-opacity-30 animate-pulse"></div>
              </div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-sm text-gray-600">🌱 Start</span>
              <span className="text-sm text-gray-600">🏆 Goal</span>
            </div>
          </div>
        </div>

        {/* Fun Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div 
            className={`bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl p-6 text-white shadow-xl transform transition-all duration-200 cursor-pointer hover:scale-105 border-4 border-white ${
              clickedCard === 'points' ? 'scale-95' : ''
            }`}
            onClick={() => handleCardClick('points')}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-6 h-6 text-yellow-300" />
                  <p className="text-blue-100 text-lg font-bold">Star Points</p>
                </div>
                <p className="text-5xl font-bold">{stats.totalPoints}</p>
                <p className="text-blue-200 text-sm">Awesome job!</p>
              </div>
              <div className="text-6xl">⭐</div>
            </div>
          </div>

          <div 
            className={`bg-gradient-to-br from-green-400 to-green-600 rounded-3xl p-6 text-white shadow-xl transform transition-all duration-200 cursor-pointer hover:scale-105 border-4 border-white ${
              clickedCard === 'level' ? 'scale-95' : ''
            }`}
            onClick={() => handleCardClick('level')}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-6 h-6 text-yellow-300" />
                  <p className="text-green-100 text-lg font-bold">Hero Level</p>
                </div>
                <p className="text-5xl font-bold">{stats.level}</p>
                <p className="text-green-200 text-sm">Keep climbing!</p>
              </div>
              <div className="text-6xl">🚀</div>
            </div>
          </div>

          <div 
            className={`bg-gradient-to-br from-purple-400 to-purple-600 rounded-3xl p-6 text-white shadow-xl transform transition-all duration-200 cursor-pointer hover:scale-105 border-4 border-white ${
              clickedCard === 'streak' ? 'scale-95' : ''
            }`}
            onClick={() => handleCardClick('streak')}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-6 h-6 text-yellow-300" />
                  <p className="text-purple-100 text-lg font-bold">Super Streak</p>
                </div>
                <p className="text-5xl font-bold">{stats.streakDays}</p>
                <p className="text-purple-200 text-sm">Days in a row!</p>
              </div>
              <div className="text-6xl">🔥</div>
            </div>
          </div>

          <div 
            className={`bg-gradient-to-br from-pink-400 to-pink-600 rounded-3xl p-6 text-white shadow-xl transform transition-all duration-200 cursor-pointer hover:scale-105 border-4 border-white ${
              clickedCard === 'waste' ? 'scale-95' : ''
            }`}
            onClick={() => handleCardClick('waste')}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-6 h-6 text-yellow-300" />
                  <p className="text-pink-100 text-lg font-bold">Earth Helper</p>
                </div>
                <p className="text-5xl font-bold">{stats.wasteReduction}%</p>
                <p className="text-pink-200 text-sm">Less waste!</p>
              </div>
              <div className="text-6xl">🌍</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Adventure Progress Map */}
          <div className="bg-white rounded-3xl shadow-xl border-4 border-yellow-300 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-4xl">🗺️</div>
              <h2 className="text-3xl font-bold text-gray-800">
                Your Adventure Map
              </h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🏰</span>
                  <span className="text-xl font-bold text-gray-700">Level {stats.level}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  <span className="text-xl font-bold text-gray-700">Level {nextLevel}</span>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-gray-200 rounded-full h-6 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 h-6 rounded-full transition-all duration-1000 relative"
                    style={{ width: `${levelProgress}%` }}
                  >
                    <div className="absolute inset-0 bg-white bg-opacity-30 animate-pulse"></div>
                  </div>
                </div>
                <div className="absolute -top-2 left-0 text-2xl animate-bounce" style={{ left: `${levelProgress}%`, transform: 'translateX(-50%)' }}>
                  🚀
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-lg font-bold text-purple-600">
                  {100 - (stats.totalPoints % 100)} more points to reach Level {nextLevel}!
                </p>
                <p className="text-gray-600">Keep going, you're almost there! 🌟</p>
              </div>
            </div>
          </div>

          {/* Achievement Showcase */}
          <div className="bg-white rounded-3xl shadow-xl border-4 border-purple-300 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-4xl">🏆</div>
              <h2 className="text-3xl font-bold text-gray-800">
                Your Awesome Badges
              </h2>
            </div>
            
            {stats.achievements.length > 0 ? (
              <div className="space-y-4">
                {stats.achievements.slice(-3).map((achievement, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl border-2 border-yellow-300 transform hover:scale-105 transition-all">
                    <div className="text-4xl animate-bounce">🏅</div>
                    <div>
                      <p className="text-xl font-bold text-orange-800">New Badge Earned!</p>
                      <p className="text-orange-600">You're doing amazing work!</p>
                    </div>
                    <div className="text-3xl ml-auto">✨</div>
                  </div>
                ))}
                <div className="text-center mt-4">
                  <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-bold text-lg hover:scale-105 transform transition-all shadow-lg">
                    See All My Badges! 🎖️
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🎁</div>
                <p className="text-xl font-bold text-gray-600 mb-2">Your first badge is waiting!</p>
                <p className="text-gray-500">Start tracking your meals to earn cool badges!</p>
              </div>
            )}
          </div>
        </div>

        {/* Today's Fun Missions */}
        <div className="bg-gradient-to-r from-green-200 via-blue-200 to-purple-200 rounded-3xl p-8 border-4 border-white shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-4xl animate-bounce">🎯</div>
            <h2 className="text-3xl font-bold text-gray-800">
              Today's Fun Missions
            </h2>
            <div className="text-4xl animate-pulse">🌟</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border-4 border-green-300 hover:scale-105 transform transition-all cursor-pointer shadow-lg">
              <div className="text-center">
                <div className="text-5xl mb-3">🍎</div>
                <h3 className="text-xl font-bold text-green-800 mb-2">Pick Your Food</h3>
                <p className="text-green-600">Choose yummy meals for today!</p>
                <div className="mt-4">
                  <button className="bg-green-500 text-white px-4 py-2 rounded-full font-bold hover:bg-green-600 transition-colors">
                    Let's Go! 🚀
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border-4 border-blue-300 hover:scale-105 transform transition-all cursor-pointer shadow-lg">
              <div className="text-center">
                <div className="text-5xl mb-3">📊</div>
                <h3 className="text-xl font-bold text-blue-800 mb-2">Track Your Food</h3>
                <p className="text-blue-600">Show how much you ate!</p>
                <div className="mt-4">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-full font-bold hover:bg-blue-600 transition-colors">
                    Track Now! 📈
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border-4 border-purple-300 hover:scale-105 transform transition-all cursor-pointer shadow-lg">
              <div className="text-center">
                <div className="text-5xl mb-3">📚</div>
                <h3 className="text-xl font-bold text-purple-800 mb-2">Learn Cool Facts</h3>
                <p className="text-purple-600">Discover amazing food secrets!</p>
                <div className="mt-4">
                  <button className="bg-purple-500 text-white px-4 py-2 rounded-full font-bold hover:bg-purple-600 transition-colors">
                    Explore! 🔍
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Friendly Helper */}
        <div className="fixed bottom-6 right-6 z-20">
          <div className="bg-yellow-400 rounded-full p-4 shadow-xl border-4 border-white cursor-pointer hover:scale-110 transform transition-all animate-bounce">
            <div className="text-4xl">🐰</div>
          </div>
          <div className="absolute bottom-20 right-0 bg-white rounded-2xl p-4 shadow-lg border-2 border-yellow-400 max-w-xs opacity-0 hover:opacity-100 transition-opacity">
            <p className="text-sm font-bold text-gray-800">Hi! I'm Buddy the Helper Bunny! 🐰</p>
            <p className="text-xs text-gray-600 mt-1">Click me if you need help!</p>
          </div>
        </div>
      </div>

      {/* Dietary Preferences Modal */}
      {showPreferencesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-4 border-purple-300">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-4xl">🍽️</div>
                <h2 className="text-3xl font-bold text-gray-800">My Food Preferences</h2>
                <div className="text-4xl">⚙️</div>
              </div>

              <div className="space-y-6">
                {/* Dietary Restrictions */}
                <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-6 border-2 border-green-300">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span>🥗</span> What I Like to Eat
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { key: 'vegetarian', label: 'Vegetarian 🌱', desc: 'No meat' },
                      { key: 'vegan', label: 'Vegan 🌿', desc: 'No animal products' },
                      { key: 'kosher', label: 'Kosher ✡️', desc: 'Kosher foods only' },
                      { key: 'halal', label: 'Halal ☪️', desc: 'Halal foods only' },
                      { key: 'dairyFree', label: 'No Dairy 🥛', desc: 'No milk products' },
                      { key: 'glutenFree', label: 'No Gluten 🌾', desc: 'No wheat/gluten' }
                    ].map(({ key, label, desc }) => (
                      <label key={key} className="flex items-center gap-3 p-3 bg-white rounded-xl border-2 border-gray-200 hover:border-green-400 cursor-pointer transition-all">
                        <input
                          type="checkbox"
                          checked={preferences[key as keyof DietaryPreferences] as boolean}
                          onChange={(e) => setPreferences(prev => ({ ...prev, [key]: e.target.checked }))}
                          className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                        />
                        <div>
                          <div className="font-bold text-gray-800">{label}</div>
                          <div className="text-sm text-gray-600">{desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Allergens */}
                <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl p-6 border-2 border-orange-300">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span>⚠️</span> Foods I Need to Avoid
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {commonAllergens.map(allergen => (
                      <label key={allergen} className="flex items-center gap-3 p-3 bg-white rounded-xl border-2 border-gray-200 hover:border-orange-400 cursor-pointer transition-all">
                        <input
                          type="checkbox"
                          checked={preferences.allergens.includes(allergen)}
                          onChange={(e) => handleAllergenChange(allergen, e.target.checked)}
                          className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                        />
                        <span className="font-medium text-gray-800">{allergen}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={handleSavePreferences}
                    className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 px-6 rounded-2xl text-xl font-bold hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>Save My Preferences</span>
                    <div className="text-2xl">✅</div>
                  </button>
                  <button
                    onClick={() => setShowPreferencesModal(false)}
                    className="px-6 py-4 border-3 border-gray-300 rounded-2xl hover:bg-gray-50 transition-colors font-bold text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};