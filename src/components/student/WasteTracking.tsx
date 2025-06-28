import React, { useState, useEffect } from 'react';
import { BarChart3, Calendar, Trophy, TrendingDown } from 'lucide-react';
import { User, WasteEntry, MealSelection, MenuItem } from '../../types';
import { storageService } from '../../utils/storage';
import { format } from 'date-fns';

interface WasteTrackingProps {
  user: User;
}

const wasteOptions = [
  { level: 'none', label: 'Finished Everything! 🎉', points: 10, color: 'bg-green-500' },
  { level: 'little', label: 'Just a Little Left 😊', points: 7, color: 'bg-blue-500' },
  { level: 'half', label: 'About Half Left 😐', points: 4, color: 'bg-yellow-500' },
  { level: 'most', label: 'Most Left 😔', points: 1, color: 'bg-orange-500' },
  { level: 'all', label: 'Didn\'t Eat Any 😞', points: 0, color: 'bg-red-500' }
];

export const WasteTracking: React.FC<WasteTrackingProps> = ({ user }) => {
  const [todaySelections, setTodaySelections] = useState<MealSelection[]>([]);
  const [wasteEntries, setWasteEntries] = useState<WasteEntry[]>([]);
  const [currentTracking, setCurrentTracking] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    if (user.id) {
      const selections = storageService.getMealSelections(user.id);
      const todaySelection = selections.filter(s => s.date === today);
      setTodaySelections(todaySelection);
      
      const waste = storageService.getWasteEntries(user.id);
      setWasteEntries(waste);
      
      // Load existing waste tracking for today
      const todayWaste = waste.filter(w => w.date === today);
      const tracking: Record<string, string> = {};
      todayWaste.forEach(entry => {
        tracking[entry.itemId] = entry.wasteLevel;
      });
      setCurrentTracking(tracking);
    }
  }, [user.id, today]);

  const handleWasteSelection = (itemId: string, itemName: string, wasteLevel: string) => {
    setCurrentTracking(prev => ({
      ...prev,
      [itemId]: wasteLevel
    }));
  };

  const handleSaveWasteTracking = async () => {
    if (!user.id) return;
    
    setIsLoading(true);
    
    try {
      // Save waste entries
      for (const [itemId, wasteLevel] of Object.entries(currentTracking)) {
        const points = wasteOptions.find(opt => opt.level === wasteLevel)?.points || 0;
        const itemName = todaySelections[0]?.selectedItems.includes(itemId) ? 
          `Item ${itemId}` : `Item ${itemId}`; // In real app, would get from menu
        
        const entry: WasteEntry = {
          id: `waste-${user.id}-${itemId}-${today}`,
          studentId: user.id,
          date: today,
          itemId,
          itemName,
          wasteLevel: wasteLevel as any,
          points,
          timestamp: new Date().toISOString()
        };
        
        storageService.saveWasteEntry(entry);
      }
      
      // Update student stats
      const stats = storageService.getStudentStats(user.id);
      const newPoints = Object.values(currentTracking).reduce((total, level) => {
        return total + (wasteOptions.find(opt => opt.level === level)?.points || 0);
      }, 0);
      
      stats.totalPoints += newPoints;
      stats.level = Math.floor(stats.totalPoints / 100) + 1;
      
      // Calculate waste reduction
      const recentEntries = storageService.getWasteEntries(user.id);
      const lowWasteEntries = recentEntries.filter(e => 
        e.wasteLevel === 'none' || e.wasteLevel === 'little'
      ).length;
      stats.wasteReduction = Math.round((lowWasteEntries / Math.max(recentEntries.length, 1)) * 100);
      
      storageService.updateStudentStats(user.id, stats);
      
      setTimeout(() => setIsLoading(false), 500);
    } catch (error) {
      console.error('Failed to save waste tracking:', error);
      setIsLoading(false);
    }
  };

  const getRecentStats = () => {
    const recentEntries = wasteEntries.slice(-7); // Last 7 entries
    const totalPoints = recentEntries.reduce((sum, entry) => sum + entry.points, 0);
    const avgPoints = recentEntries.length > 0 ? totalPoints / recentEntries.length : 0;
    return { totalPoints, avgPoints, entriesCount: recentEntries.length };
  };

  const stats = getRecentStats();

  if (todaySelections.length === 0) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">
            No meals selected for today
          </h2>
          <p className="text-gray-500 mb-6">
            Visit the Meal Selection page to choose your meals first!
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Meal Selection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Waste Tracking 📊
        </h1>
        <p className="text-gray-600">
          Track how much of your meal you finished. Every bite helps reduce waste!
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Recent Points</p>
              <p className="text-3xl font-bold">{stats.totalPoints}</p>
            </div>
            <Trophy className="w-10 h-10 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Avg Points/Meal</p>
              <p className="text-3xl font-bold">{stats.avgPoints.toFixed(1)}</p>
            </div>
            <BarChart3 className="w-10 h-10 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Meals Tracked</p>
              <p className="text-3xl font-bold">{stats.entriesCount}</p>
            </div>
            <TrendingDown className="w-10 h-10 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Today's Tracking */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Track Today's Meals - {format(new Date(), 'EEEE, MMMM d')}
          </h2>

          {todaySelections.map((selection) => (
            <div key={selection.id} className="space-y-6">
              {selection.selectedItems.map((itemId, index) => (
                <div key={itemId} className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">
                    Meal Item #{index + 1}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    {wasteOptions.map((option) => (
                      <button
                        key={option.level}
                        onClick={() => handleWasteSelection(itemId, `Item ${itemId}`, option.level)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          currentTracking[itemId] === option.level
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        aria-pressed={currentTracking[itemId] === option.level}
                      >
                        <div className="text-center">
                          <div className={`w-8 h-8 ${option.color} rounded-full mx-auto mb-2`}></div>
                          <p className="text-sm font-medium text-gray-800">{option.label}</p>
                          <p className="text-xs text-gray-600 mt-1">+{option.points} points</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="text-center">
        <button
          onClick={handleSaveWasteTracking}
          disabled={isLoading || Object.keys(currentTracking).length === 0}
          className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2 mx-auto"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <Trophy className="w-5 h-5" />
          )}
          {isLoading ? 'Saving...' : 'Save Waste Tracking'}
        </button>
        
        {Object.keys(currentTracking).length === 0 && (
          <p className="text-sm text-gray-500 mt-2">
            Please track all your meal items before saving
          </p>
        )}
      </div>
    </div>
  );
};