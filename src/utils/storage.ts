import { 
  WeeklyMenu, 
  MealSelection, 
  WasteEntry, 
  Achievement, 
  StudentAchievement, 
  StudentStats,
  EducationalContent,
  WasteMetrics,
  ClassSustainabilityMetrics,
  DietaryPreferences,
  MenuItem
} from '../types';

// Initialize demo data
const initializeDemoData = () => {
  if (!localStorage.getItem('taste_not_waste_initialized')) {
    // Demo achievements
    const achievements: Achievement[] = [
      {
        id: 'clean-plate-1',
        name: 'Clean Plate Club',
        description: 'Finished your meal with minimal waste!',
        icon: '🍽️',
        points: 10,
        category: 'waste-reduction'
      },
      {
        id: 'veggie-lover',
        name: 'Veggie Lover',
        description: 'Chose vegetables 5 days in a row!',
        icon: '🥗',
        points: 25,
        category: 'healthy-choices'
      },
      {
        id: 'consistency-king',
        name: 'Consistency Champion',
        description: 'Tracked your meals for 7 days straight!',
        icon: '⭐',
        points: 30,
        category: 'consistency'
      },
      {
        id: 'eco-warrior',
        name: 'Eco Warrior',
        description: 'Reduced waste by 50% this week!',
        icon: '🌱',
        points: 50,
        category: 'waste-reduction'
      }
    ];

    // Demo educational content
    const educationalContent: EducationalContent[] = [
      {
        id: 'nutrition-1',
        title: 'Why Vegetables Are Super Foods',
        content: 'Vegetables give you energy to play and learn! They have vitamins that help your body grow strong.',
        imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        category: 'nutrition',
        ageGroup: 'grades-3-5'
      },
      {
        id: 'environment-1',
        title: 'How Food Waste Affects Our Planet',
        content: 'When we throw away food, it hurts our planet. Let\'s work together to use every bite!',
        imageUrl: 'https://images.pexels.com/photos/3850512/pexels-photo-3850512.jpeg',
        category: 'environment',
        ageGroup: 'grades-3-5'
      }
    ];

    // Demo class metrics
    const classMetrics: ClassSustainabilityMetrics = {
      classId: 'default',
      date: new Date().toISOString().split('T')[0],
      totalStudents: 25,
      participatingStudents: 22,
      wasteReductionGoal: 30,
      currentWasteReduction: 24,
      dailyProgress: 8,
      weeklyProgress: 18,
      monthlyProgress: 24,
      achievements: ['Clean Plate Week', 'Veggie Champions'],
      topPerformers: ['Emma', 'Alex', 'Maya']
    };

    localStorage.setItem('taste_not_waste_achievements', JSON.stringify(achievements));
    localStorage.setItem('taste_not_waste_educational_content', JSON.stringify(educationalContent));
    localStorage.setItem('taste_not_waste_class_metrics_default', JSON.stringify(classMetrics));
    localStorage.setItem('taste_not_waste_initialized', 'true');
  }
};

// Generate enhanced demo menu with wildcard items
const generateEnhancedMenu = (): WeeklyMenu => {
  const wildcardItems: MenuItem[] = [
    {
      id: 'wildcard-1',
      name: '🌟 Mystery Veggie Wrap',
      category: 'vegetable',
      description: 'A surprise wrap with seasonal vegetables picked just for you!',
      allergens: ['gluten'],
      nutritionScore: 9,
      imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      available: true,
      isWildcard: true,
      isLocal: true,
      isSeasonal: true,
      ingredients: ['Seasonal vegetables', 'Whole wheat tortilla', 'Hummus', 'Fresh herbs'],
      dietaryTags: ['vegetarian', 'high-fiber'],
      calories: 280,
      protein: 12,
      carbs: 45,
      fat: 8,
      fiber: 9
    },
    {
      id: 'wildcard-2',
      name: '🎲 Chef\'s Special Protein Bowl',
      category: 'protein',
      description: 'Our chef\'s favorite protein combination - it changes every day!',
      allergens: [],
      nutritionScore: 8,
      imageUrl: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg',
      available: true,
      isWildcard: true,
      isLocal: false,
      isSeasonal: false,
      ingredients: ['Lean protein', 'Quinoa', 'Roasted vegetables', 'Tahini sauce'],
      dietaryTags: ['high-protein', 'gluten-free'],
      calories: 350,
      protein: 25,
      carbs: 30,
      fat: 12,
      fiber: 6
    }
  ];

  return {
    id: 'enhanced-week-1',
    weekOf: new Date().toISOString().split('T')[0],
    days: Array.from({ length: 5 }, (_, i) => ({
      id: `enhanced-day-${i}`,
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [], // Will be populated with regular items
      wildcardItem: wildcardItems[i % wildcardItems.length],
      specialMessage: i === 0 ? '🌟 Try today\'s wildcard item for bonus points!' : undefined,
      seasonalHighlight: 'Fresh fall vegetables from local farms! 🍂'
    }))
  };
};

export const storageService = {
  // Initialize demo data on first load
  init: () => {
    initializeDemoData();
  },

  // Weekly Menu Management
  getWeeklyMenu: (): WeeklyMenu | null => {
    const stored = localStorage.getItem('taste_not_waste_weekly_menu');
    return stored ? JSON.parse(stored) : null;
  },

  saveWeeklyMenu: (menu: WeeklyMenu): void => {
    localStorage.setItem('taste_not_waste_weekly_menu', JSON.stringify(menu));
  },

  getEnhancedWeeklyMenu: (): WeeklyMenu => {
    const stored = localStorage.getItem('taste_not_waste_enhanced_weekly_menu');
    if (stored) {
      return JSON.parse(stored);
    }
    
    const menu = generateEnhancedMenu();
    localStorage.setItem('taste_not_waste_enhanced_weekly_menu', JSON.stringify(menu));
    return menu;
  },

  // Meal Selections
  getMealSelections: (studentId: string): MealSelection[] => {
    const stored = localStorage.getItem(`taste_not_waste_selections_${studentId}`);
    return stored ? JSON.parse(stored) : [];
  },

  saveMealSelection: (selection: MealSelection): void => {
    const existing = storageService.getMealSelections(selection.studentId);
    const filtered = existing.filter(s => s.date !== selection.date);
    filtered.push(selection);
    localStorage.setItem(`taste_not_waste_selections_${selection.studentId}`, JSON.stringify(filtered));
  },

  // Waste Tracking
  getWasteEntries: (studentId: string): WasteEntry[] => {
    const stored = localStorage.getItem(`taste_not_waste_waste_${studentId}`);
    return stored ? JSON.parse(stored) : [];
  },

  saveWasteEntry: (entry: WasteEntry): void => {
    const existing = storageService.getWasteEntries(entry.studentId);
    existing.push(entry);
    localStorage.setItem(`taste_not_waste_waste_${entry.studentId}`, JSON.stringify(existing));
  },

  // Student Stats and Achievements
  getStudentStats: (studentId: string): StudentStats => {
    const stored = localStorage.getItem(`taste_not_waste_stats_${studentId}`);
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Default stats for new students
    return {
      totalPoints: 0,
      wasteReduction: 0,
      streakDays: 0,
      level: 1,
      achievements: [],
      favoriteMeals: [],
      mealRatings: {}
    };
  },

  updateStudentStats: (studentId: string, stats: StudentStats): void => {
    localStorage.setItem(`taste_not_waste_stats_${studentId}`, JSON.stringify(stats));
  },

  // Achievements
  getAchievements: (): Achievement[] => {
    const stored = localStorage.getItem('taste_not_waste_achievements');
    return stored ? JSON.parse(stored) : [];
  },

  // Educational Content
  getEducationalContent: (): EducationalContent[] => {
    const stored = localStorage.getItem('taste_not_waste_educational_content');
    return stored ? JSON.parse(stored) : [];
  },

  // Analytics (for admin)
  getWasteMetrics: (): WasteMetrics[] => {
    const stored = localStorage.getItem('taste_not_waste_waste_metrics');
    return stored ? JSON.parse(stored) : [];
  },

  updateWasteMetrics: (metrics: WasteMetrics): void => {
    const existing = storageService.getWasteMetrics();
    const filtered = existing.filter(m => m.date !== metrics.date);
    filtered.push(metrics);
    localStorage.setItem('taste_not_waste_waste_metrics', JSON.stringify(filtered));
  },

  // Class Sustainability Metrics
  getClassMetrics: (classId: string): ClassSustainabilityMetrics => {
    const stored = localStorage.getItem(`taste_not_waste_class_metrics_${classId}`);
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Default metrics
    return {
      classId,
      date: new Date().toISOString().split('T')[0],
      totalStudents: 25,
      participatingStudents: 20,
      wasteReductionGoal: 30,
      currentWasteReduction: 18,
      dailyProgress: 5,
      weeklyProgress: 15,
      monthlyProgress: 18,
      achievements: [],
      topPerformers: []
    };
  },

  updateClassMetrics: (metrics: ClassSustainabilityMetrics): void => {
    localStorage.setItem(`taste_not_waste_class_metrics_${metrics.classId}`, JSON.stringify(metrics));
  },

  // User Preferences
  getUserPreferences: (userId: string): DietaryPreferences => {
    const stored = localStorage.getItem(`taste_not_waste_preferences_${userId}`);
    if (stored) {
      return JSON.parse(stored);
    }
    
    return {
      vegetarian: false,
      vegan: false,
      kosher: false,
      halal: false,
      dairyFree: false,
      glutenFree: false,
      allergens: [],
      customRestrictions: []
    };
  },

  updateUserPreferences: (userId: string, preferences: DietaryPreferences): void => {
    localStorage.setItem(`taste_not_waste_preferences_${userId}`, JSON.stringify(preferences));
  },

  // Meal Ratings and Favorites
  saveMealRating: (studentId: string, mealId: string, rating: number): void => {
    const stats = storageService.getStudentStats(studentId);
    stats.mealRatings[mealId] = rating;
    storageService.updateStudentStats(studentId, stats);
  },

  addFavoriteMeal: (studentId: string, mealId: string): void => {
    const stats = storageService.getStudentStats(studentId);
    if (!stats.favoriteMeals.includes(mealId)) {
      stats.favoriteMeals.push(mealId);
      storageService.updateStudentStats(studentId, stats);
    }
  },

  removeFavoriteMeal: (studentId: string, mealId: string): void => {
    const stats = storageService.getStudentStats(studentId);
    stats.favoriteMeals = stats.favoriteMeals.filter(id => id !== mealId);
    storageService.updateStudentStats(studentId, stats);
  },

  // AI Recommendations (mock implementation)
  getWildcardRecommendation: (studentId: string, preferences: DietaryPreferences): MenuItem => {
    const wildcardOptions: MenuItem[] = [
      {
        id: 'ai-rec-1',
        name: '🤖 AI\'s Pick: Rainbow Veggie Bowl',
        category: 'vegetable',
        description: 'Our AI chef thinks you\'ll love this colorful mix of seasonal vegetables!',
        allergens: [],
        nutritionScore: 9,
        imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        available: true,
        isWildcard: true,
        isLocal: true,
        isSeasonal: true,
        ingredients: ['Roasted sweet potato', 'Purple cabbage', 'Chickpeas', 'Avocado', 'Tahini dressing'],
        dietaryTags: ['vegan', 'gluten-free', 'high-fiber'],
        calories: 320,
        protein: 14,
        carbs: 42,
        fat: 12,
        fiber: 11
      },
      {
        id: 'ai-rec-2',
        name: '🎯 Perfect Match: Protein Power Plate',
        category: 'protein',
        description: 'Based on your preferences, this protein-packed meal is perfect for you!',
        allergens: [],
        nutritionScore: 8,
        imageUrl: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg',
        available: true,
        isWildcard: true,
        isLocal: false,
        isSeasonal: false,
        ingredients: ['Grilled chicken', 'Quinoa', 'Steamed broccoli', 'Cherry tomatoes'],
        dietaryTags: ['high-protein', 'gluten-free'],
        calories: 380,
        protein: 28,
        carbs: 35,
        fat: 10,
        fiber: 7
      }
    ];

    // Simple recommendation logic based on preferences
    if (preferences.vegetarian || preferences.vegan) {
      return wildcardOptions[0];
    }
    
    return wildcardOptions[1];
  }
};