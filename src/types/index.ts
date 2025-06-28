export interface User {
  id: string;
  email: string;
  role: 'student' | 'admin';
  name: string;
  grade?: number;
  school?: string;
  createdAt: string;
  dietaryPreferences?: DietaryPreferences;
}

export interface DietaryPreferences {
  vegetarian: boolean;
  vegan: boolean;
  kosher: boolean;
  halal: boolean;
  dairyFree: boolean;
  glutenFree: boolean;
  allergens: string[];
  customRestrictions: string[];
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'protein' | 'vegetable' | 'grain' | 'fruit' | 'dairy';
  description: string;
  allergens: string[];
  nutritionScore: number;
  imageUrl: string;
  available: boolean;
  isWildcard?: boolean;
  isLocal?: boolean;
  isSeasonal?: boolean;
  ingredients: string[];
  dietaryTags: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface DailyMenu {
  id: string;
  date: string;
  items: MenuItem[];
  specialMessage?: string;
  wildcardItem?: MenuItem;
  seasonalHighlight?: string;
}

export interface WeeklyMenu {
  id: string;
  weekOf: string;
  days: DailyMenu[];
}

export interface MealSelection {
  id: string;
  studentId: string;
  date: string;
  selectedItems: string[];
  timestamp: string;
  rating?: number;
  feedback?: string;
}

export interface WasteEntry {
  id: string;
  studentId: string;
  date: string;
  itemId: string;
  itemName: string;
  wasteLevel: 'none' | 'little' | 'half' | 'most' | 'all';
  points: number;
  timestamp: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  category: 'waste-reduction' | 'healthy-choices' | 'consistency' | 'special';
}

export interface StudentAchievement {
  id: string;
  studentId: string;
  achievementId: string;
  earnedAt: string;
}

export interface StudentStats {
  totalPoints: number;
  wasteReduction: number;
  streakDays: number;
  level: number;
  achievements: StudentAchievement[];
  favoriteMeals: string[];
  mealRatings: Record<string, number>;
}

export interface ClassSustainabilityMetrics {
  classId: string;
  date: string;
  totalStudents: number;
  participatingStudents: number;
  wasteReductionGoal: number;
  currentWasteReduction: number;
  dailyProgress: number;
  weeklyProgress: number;
  monthlyProgress: number;
  achievements: string[];
  topPerformers: string[];
}

export interface WasteMetrics {
  date: string;
  totalStudents: number;
  totalMeals: number;
  wasteByCategory: Record<string, number>;
  wasteByLevel: Record<string, number>;
  averageWastePerStudent: number;
}

export interface EducationalContent {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  category: 'nutrition' | 'environment' | 'fun-facts';
  ageGroup: string;
}