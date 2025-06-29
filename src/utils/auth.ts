import { User } from '../types';

const STORAGE_KEY = 'taste_not_waste_user';

export const authService = {
  login: (email: string, password: string): Promise<User | null> => {
    return new Promise((resolve) => {
      // Remove setTimeout to make it more reliable on slower connections
      // Demo credentials - made more flexible for production
      const demoUsers: User[] = [
        {
          id: 'admin-1',
          email: 'admin@tastenotwaste.demo',
          role: 'admin',
          name: 'Admin User',
          school: 'NYC Department of Education',
          createdAt: new Date().toISOString()
        },
        {
          id: 'student-1',
          email: 'student@tastenotwaste.demo',
          role: 'student',
          name: 'Emma Rodriguez',
          grade: 4,
          school: 'PS 123 Manhattan',
          createdAt: new Date().toISOString(),
          dietaryPreferences: {
            vegetarian: false,
            vegan: false,
            kosher: false,
            halal: false,
            dairyFree: false,
            glutenFree: false,
            allergens: [],
            customRestrictions: []
          }
        }
      ];

      // More flexible password matching for demo
      const normalizedEmail = email.toLowerCase().trim();
      const normalizedPassword = password.toLowerCase().trim();
      
      const user = demoUsers.find(u => {
        const userEmail = u.email.toLowerCase();
        const validPasswords = ['demo2024', 'password', 'demo'];
        
        return userEmail === normalizedEmail && 
               validPasswords.includes(normalizedPassword);
      });

      if (user) {
        try {
          // Ensure localStorage is available and working
          if (typeof Storage !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
            console.log('✅ Demo login successful:', user.role, user.name);
          }
          resolve(user);
        } catch (error) {
          console.error('❌ localStorage error:', error);
          // Still resolve with user even if localStorage fails
          resolve(user);
        }
      } else {
        console.log('❌ Demo login failed for:', normalizedEmail);
        resolve(null);
      }
    });
  },

  logout: (): void => {
    try {
      if (typeof Storage !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  getCurrentUser: (): User | null => {
    try {
      if (typeof Storage !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
      }
    } catch (error) {
      console.error('Get current user error:', error);
    }
    return null;
  },

  isAuthenticated: (): boolean => {
    try {
      if (typeof Storage !== 'undefined') {
        return !!localStorage.getItem(STORAGE_KEY);
      }
    } catch (error) {
      console.error('Is authenticated error:', error);
    }
    return false;
  }
};