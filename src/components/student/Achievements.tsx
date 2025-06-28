import React, { useState, useEffect } from 'react';
import { Award, Star, Target, TrendingUp } from 'lucide-react';
import { User, Achievement, StudentStats, StudentAchievement } from '../../types';
import { storageService } from '../../utils/storage';

interface AchievementsProps {
  user: User;
}

export const Achievements: React.FC<AchievementsProps> = ({ user }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [studentStats, setStudentStats] = useState<StudentStats | null>(null);
  const [earnedAchievements, setEarnedAchievements] = useState<Set<string>>(new Set());

  useEffect(() => {
    const allAchievements = storageService.getAchievements();
    setAchievements(allAchievements);
    
    if (user.id) {
      const stats = storageService.getStudentStats(user.id);
      setStudentStats(stats);
      
      const earnedIds = new Set(stats.achievements.map(a => a.achievementId));
      setEarnedAchievements(earnedIds);
    }
  }, [user.id]);

  if (!studentStats) {
    return <div className="p-6">Loading achievements...</div>;
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'waste-reduction': return '🌱';
      case 'healthy-choices': return '🥗';
      case 'consistency': return '⭐';
      case 'special': return '🏆';
      default: return '🎯';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'waste-reduction': return 'bg-green-100 text-green-700 border-green-200';
      case 'healthy-choices': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'consistency': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'special': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const groupedAchievements = achievements.reduce((groups, achievement) => {
    const category = achievement.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(achievement);
    return groups;
  }, {} as Record<string, Achievement[]>);

  const totalEarned = earnedAchievements.size;
  const totalAvailable = achievements.length;
  const completionPercentage = (totalEarned / totalAvailable) * 100;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Your Achievements 🏆
        </h1>
        <p className="text-gray-600">
          Earn badges by making healthy choices and reducing food waste!
        </p>
      </div>

      {/* Progress Overview */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Achievement Progress</h2>
          <div className="text-right">
            <p className="text-2xl font-bold text-orange-600">{totalEarned}/{totalAvailable}</p>
            <p className="text-sm text-gray-600">Achievements Earned</p>
          </div>
        </div>
        
        <div className="bg-gray-200 rounded-full h-4 mb-4">
          <div 
            className="bg-gradient-to-r from-yellow-500 to-orange-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
            role="progressbar"
            aria-valuenow={completionPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Achievement progress: ${completionPercentage.toFixed(0)}%`}
          ></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="bg-white rounded-lg p-4">
              <Award className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="font-medium text-gray-800">Level {studentStats.level}</p>
              <p className="text-sm text-gray-600">Current Level</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-lg p-4">
              <Star className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="font-medium text-gray-800">{studentStats.totalPoints}</p>
              <p className="text-sm text-gray-600">Total Points</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-lg p-4">
              <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="font-medium text-gray-800">{studentStats.streakDays} days</p>
              <p className="text-sm text-gray-600">Current Streak</p>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Categories */}
      {Object.entries(groupedAchievements).map(([category, categoryAchievements]) => (
        <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">{getCategoryIcon(category)}</span>
              <h2 className="text-xl font-semibold text-gray-800 capitalize">
                {category.replace('-', ' ')} Achievements
              </h2>
              <span className={`px-3 py-1 rounded-full text-sm border ${getCategoryColor(category)}`}>
                {categoryAchievements.filter(a => earnedAchievements.has(a.id)).length}/{categoryAchievements.length}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryAchievements.map((achievement) => {
                const isEarned = earnedAchievements.has(achievement.id);
                
                return (
                  <div
                    key={achievement.id}
                    className={`border-2 rounded-xl p-6 transition-all ${
                      isEarned
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`text-6xl mb-4 ${
                        isEarned ? 'grayscale-0' : 'grayscale opacity-50'
                      }`}>
                        {achievement.icon}
                      </div>
                      
                      <h3 className={`text-lg font-semibold mb-2 ${
                        isEarned ? 'text-green-800' : 'text-gray-600'
                      }`}>
                        {achievement.name}
                      </h3>
                      
                      <p className={`text-sm mb-4 ${
                        isEarned ? 'text-green-700' : 'text-gray-500'
                      }`}>
                        {achievement.description}
                      </p>
                      
                      <div className={`flex items-center justify-center gap-1 ${
                        isEarned ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        <Star className="w-4 h-4" />
                        <span className="text-sm font-medium">+{achievement.points} points</span>
                      </div>
                      
                      {isEarned && (
                        <div className="mt-4 p-2 bg-green-100 rounded-lg">
                          <p className="text-xs text-green-700 font-medium">
                            🎉 Achievement Unlocked!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}

      {/* Next Goals */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Target className="w-6 h-6 text-blue-600" />
          What's Next?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-medium text-gray-800 mb-2">Keep Your Streak Going!</h3>
            <p className="text-sm text-gray-600">
              Track your meals daily to maintain your current {studentStats.streakDays}-day streak.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-medium text-gray-800 mb-2">Reduce More Waste</h3>
            <p className="text-sm text-gray-600">
              Try to finish more of your meals to earn waste reduction achievements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};