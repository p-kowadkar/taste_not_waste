import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/student/Dashboard';
import { EnhancedMealSelection } from './components/student/EnhancedMealSelection';
import { WasteTracking } from './components/student/WasteTracking';
import { Achievements } from './components/student/Achievements';
import { Education } from './components/student/Education';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { MenuManagement } from './components/admin/MenuManagement';
import { authService } from './utils/auth';
import { storageService } from './utils/storage';
import { User, DietaryPreferences } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize storage and check for existing session
    storageService.init();
    
    const existingUser = authService.getCurrentUser();
    if (existingUser) {
      setUser(existingUser);
      setCurrentView(existingUser.role === 'student' ? 'dashboard' : 'admin-dashboard');
    }
    
    setIsLoading(false);
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentView(userData.role === 'student' ? 'dashboard' : 'admin-dashboard');
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setCurrentView('dashboard');
  };

  const handleUpdatePreferences = (preferences: DietaryPreferences) => {
    if (user) {
      const updatedUser = { ...user, dietaryPreferences: preferences };
      setUser(updatedUser);
      // Update in localStorage
      localStorage.setItem('taste_not_waste_user', JSON.stringify(updatedUser));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-6"></div>
          <p className="text-2xl font-bold text-purple-600">Loading Taste Not Waste...</p>
          <p className="text-lg text-gray-600 mt-2">Getting your adventure ready! 🌟</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderCurrentView = () => {
    if (user.role === 'student') {
      switch (currentView) {
        case 'dashboard':
          return <Dashboard user={user} onLogout={handleLogout} onUpdatePreferences={handleUpdatePreferences} />;
        case 'meal-selection':
          return <EnhancedMealSelection user={user} />;
        case 'waste-tracking':
          return <WasteTracking user={user} />;
        case 'achievements':
          return <Achievements user={user} />;
        case 'education':
          return <Education user={user} />;
        default:
          return <Dashboard user={user} onLogout={handleLogout} onUpdatePreferences={handleUpdatePreferences} />;
      }
    } else {
      switch (currentView) {
        case 'admin-dashboard':
          return <AdminDashboard user={user} />;
        case 'menu-management':
          return <MenuManagement user={user} />;
        case 'analytics':
          return <AdminDashboard user={user} />; // Reuse for demo
        case 'students':
          return <AdminDashboard user={user} />; // Placeholder
        case 'reports':
          return <AdminDashboard user={user} />; // Placeholder
        default:
          return <AdminDashboard user={user} />;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        user={user}
        onLogout={handleLogout}
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      <main role="main" id={`panel-${currentView}`}>
        {renderCurrentView()}
      </main>
    </div>
  );
}

export default App;