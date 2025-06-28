import { User } from '../types';

const STORAGE_KEY = 'taste_not_waste_user';

export const authService = {
  login: (email: string, password: string): Promise<User | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Demo credentials
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
            createdAt: new Date().toISOString()
          }
        ];

        const user = demoUsers.find(u => 
          u.email === email && 
          (password === 'demo2024' || password === 'password')
        );

        if (user) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
          resolve(user);
        } else {
          resolve(null);
        }
      }, 500);
    });
  },

  logout: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(STORAGE_KEY);
  }
};