import React from 'react';
import { LogOut, User, Settings, Leaf } from 'lucide-react';
import { User as UserType } from '../types';

interface NavigationProps {
  user: UserType;
  onLogout: () => void;
  currentView: string;
  onViewChange: (view: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  user, 
  onLogout, 
  currentView, 
  onViewChange 
}) => {
  const studentViews = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'meal-selection', label: 'Meal Selection', icon: '🍽️' },
    { id: 'waste-tracking', label: 'Waste Tracking', icon: '📊' },
    { id: 'achievements', label: 'Achievements', icon: '🏆' },
    { id: 'education', label: 'Learn', icon: '📚' }
  ];

  const adminViews = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'menu-management', label: 'Menu Management', icon: '🍽️' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'students', label: 'Students', icon: '👥' },
    { id: 'reports', label: 'Reports', icon: '📋' }
  ];

  const views = user.role === 'student' ? studentViews : adminViews;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex items-center gap-3">
              <Leaf className="w-8 h-8 text-green-600" />
              <h1 className="text-xl font-bold text-gray-800">Taste Not Waste 🌱</h1>
            </div>
            
            <div className="hidden md:flex ml-10 space-x-8" role="tablist">
              {views.map((view) => (
                <button
                  key={view.id}
                  onClick={() => onViewChange(view.id)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    currentView === view.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  role="tab"
                  aria-selected={currentView === view.id}
                  aria-controls={`panel-${view.id}`}
                >
                  <span className="mr-2">{view.icon}</span>
                  {view.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">{user.name}</span>
              <span className="text-gray-500">({user.role})</span>
            </div>
            
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="md:hidden pb-3">
          <div className="flex space-x-1 overflow-x-auto" role="tablist">
            {views.map((view) => (
              <button
                key={view.id}
                onClick={() => onViewChange(view.id)}
                className={`flex-shrink-0 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                  currentView === view.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                role="tab"
                aria-selected={currentView === view.id}
              >
                <span className="mr-1">{view.icon}</span>
                {view.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};