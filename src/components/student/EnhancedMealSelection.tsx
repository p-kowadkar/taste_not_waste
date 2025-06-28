import React, { useState, useEffect } from 'react';
import { Calendar, Check, X, Clock, ChefHat, Star, Heart, Sparkles, MapPin, Leaf, Filter, ThumbsUp, ThumbsDown } from 'lucide-react';
import { User, WeeklyMenu, DailyMenu, MenuItem, MealSelection as MealSelectionType, DietaryPreferences } from '../../types';
import { storageService } from '../../utils/storage';
import { format, addDays, startOfWeek } from 'date-fns';

interface EnhancedMealSelectionProps {
  user: User;
}

// Generate enhanced demo menu with seasonal and local items
const generateEnhancedDemoMenu = (): WeeklyMenu => {
  const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
  
  const enhancedItems: MenuItem[] = [
    {
      id: 'pizza-enhanced',
      name: 'Farm Fresh Veggie Pizza',
      category: 'protein',
      description: 'Crispy whole wheat crust topped with local mozzarella and seasonal vegetables! 🍕',
      allergens: ['gluten', 'dairy'],
      nutritionScore: 8,
      imageUrl: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg',
      available: true,
      isLocal: true,
      isSeasonal: true,
      ingredients: ['Whole wheat crust', 'Local mozzarella', 'Seasonal bell peppers', 'Fresh basil', 'Organic tomato sauce'],
      dietaryTags: ['vegetarian', 'locally-sourced'],
      calories: 320,
      protein: 15,
      carbs: 42,
      fat: 12,
      fiber: 6
    },
    {
      id: 'salad-enhanced',
      name: 'Superhero Garden Salad',
      category: 'vegetable',
      description: 'Power-packed salad with rainbow vegetables straight from local farms! 🌈',
      allergens: [],
      nutritionScore: 10,
      imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      available: true,
      isLocal: true,
      isSeasonal: true,
      ingredients: ['Mixed greens', 'Cherry tomatoes', 'Carrots', 'Cucumbers', 'Sunflower seeds', 'Olive oil dressing'],
      dietaryTags: ['vegan', 'gluten-free', 'locally-sourced', 'high-fiber'],
      calories: 180,
      protein: 6,
      carbs: 15,
      fat: 12,
      fiber: 8
    },
    {
      id: 'chicken-enhanced',
      name: 'Adventure Chicken Strips',
      category: 'protein',
      description: 'Tender, herb-crusted chicken strips that make every bite an adventure! 🍗',
      allergens: [],
      nutritionScore: 9,
      imageUrl: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg',
      available: true,
      isLocal: false,
      isSeasonal: false,
      ingredients: ['Free-range chicken breast', 'Herb seasoning', 'Whole wheat breadcrumbs'],
      dietaryTags: ['high-protein', 'gluten-free-option'],
      calories: 280,
      protein: 32,
      carbs: 8,
      fat: 12,
      fiber: 2
    },
    {
      id: 'rice-enhanced',
      name: 'Energy Boost Brown Rice',
      category: 'grain',
      description: 'Fluffy brown rice that gives you superpowers for learning and playing! 🍚',
      allergens: [],
      nutritionScore: 8,
      imageUrl: 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg',
      available: true,
      isLocal: false,
      isSeasonal: false,
      ingredients: ['Organic brown rice', 'Vegetable broth', 'Fresh herbs'],
      dietaryTags: ['vegan', 'gluten-free', 'whole-grain'],
      calories: 220,
      protein: 5,
      carbs: 45,
      fat: 2,
      fiber: 4
    },
    {
      id: 'fruit-enhanced',
      name: 'Magical Apple Slices',
      category: 'fruit',
      description: 'Crisp, sweet apple slices from local orchards - nature\'s candy! 🍎',
      allergens: [],
      nutritionScore: 10,
      imageUrl: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg',
      available: true,
      isLocal: true,
      isSeasonal: true,
      ingredients: ['Fresh local apples', 'Cinnamon sprinkle'],
      dietaryTags: ['vegan', 'gluten-free', 'locally-sourced', 'seasonal'],
      calories: 95,
      protein: 0,
      carbs: 25,
      fat: 0,
      fiber: 4
    }
  ];

  const wildcardItems: MenuItem[] = [
    {
      id: 'wildcard-mystery-wrap',
      name: '🌟 Mystery Veggie Wrap of the Day',
      category: 'vegetable',
      description: 'Our chef\'s special surprise wrap with seasonal vegetables - what will it be today?',
      allergens: ['gluten'],
      nutritionScore: 9,
      imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      available: true,
      isWildcard: true,
      isLocal: true,
      isSeasonal: true,
      ingredients: ['Whole wheat tortilla', 'Seasonal mystery vegetables', 'Hummus', 'Fresh herbs'],
      dietaryTags: ['vegetarian', 'locally-sourced', 'seasonal'],
      calories: 290,
      protein: 12,
      carbs: 48,
      fat: 8,
      fiber: 9
    },
    {
      id: 'wildcard-protein-bowl',
      name: '🎲 Chef\'s Choice Protein Bowl',
      category: 'protein',
      description: 'A surprise protein combination that changes daily - trust our chef to make it amazing!',
      allergens: [],
      nutritionScore: 8,
      imageUrl: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg',
      available: true,
      isWildcard: true,
      isLocal: false,
      isSeasonal: false,
      ingredients: ['Chef\'s choice protein', 'Quinoa', 'Roasted vegetables', 'Special sauce'],
      dietaryTags: ['high-protein', 'gluten-free'],
      calories: 350,
      protein: 25,
      carbs: 30,
      fat: 12,
      fiber: 6
    }
  ];

  const days: DailyMenu[] = [];
  const specialMessages = [
    "🌟 Monday Magic: Try our wildcard item for bonus adventure points!",
    "🎉 Tasty Tuesday: Local farms delivered fresh vegetables this morning!",
    "🥗 Wonderful Wednesday: Mix and match to create your perfect meal!",
    "🍕 Thrilling Thursday: Pizza made with love and healthy ingredients!",
    "🎈 Fantastic Friday: Celebrate the week with special seasonal treats!"
  ];

  for (let i = 0; i < 5; i++) {
    days.push({
      id: `enhanced-day-${i}`,
      date: format(addDays(startDate, i), 'yyyy-MM-dd'),
      items: enhancedItems,
      wildcardItem: wildcardItems[i % wildcardItems.length],
      specialMessage: specialMessages[i],
      seasonalHighlight: 'Fresh fall harvest from local farms! 🍂🥕'
    });
  }

  return {
    id: 'enhanced-week-1',
    weekOf: format(startDate, 'yyyy-MM-dd'),
    days
  };
};

export const EnhancedMealSelection: React.FC<EnhancedMealSelectionProps> = ({ user }) => {
  const [weeklyMenu, setWeeklyMenu] = useState<WeeklyMenu | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [clickedItem, setClickedItem] = useState<string | null>(null);
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
  const [showFilters, setShowFilters] = useState(false);
  const [filterBy, setFilterBy] = useState<string>('all');
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load enhanced menu
    const menu = generateEnhancedDemoMenu();
    setWeeklyMenu(menu);
    storageService.saveWeeklyMenu(menu);

    // Load existing selections
    if (user.id) {
      const userSelections = storageService.getMealSelections(user.id);
      const selectionMap: Record<string, string[]> = {};
      userSelections.forEach(selection => {
        selectionMap[selection.date] = selection.selectedItems;
      });
      setSelections(selectionMap);

      // Load user stats for favorites and ratings
      const stats = storageService.getStudentStats(user.id);
      setRatings(stats.mealRatings);
      setFavorites(new Set(stats.favoriteMeals));
    }
  }, [user.id]);

  const handleItemToggle = (date: string, itemId: string) => {
    setClickedItem(itemId);
    setTimeout(() => setClickedItem(null), 200);
    
    setSelections(prev => {
      const daySelections = prev[date] || [];
      const isSelected = daySelections.includes(itemId);
      
      const newSelections = {
        ...prev,
        [date]: isSelected 
          ? daySelections.filter(id => id !== itemId)
          : [...daySelections, itemId]
      };
      
      return newSelections;
    });
  };

  const handleRating = (itemId: string, rating: number) => {
    setRatings(prev => ({ ...prev, [itemId]: rating }));
    if (user.id) {
      storageService.saveMealRating(user.id, itemId, rating);
    }
  };

  const handleFavoriteToggle = (itemId: string) => {
    const newFavorites = new Set(favorites);
    if (favorites.has(itemId)) {
      newFavorites.delete(itemId);
      if (user.id) storageService.removeFavoriteMeal(user.id, itemId);
    } else {
      newFavorites.add(itemId);
      if (user.id) storageService.addFavoriteMeal(user.id, itemId);
    }
    setFavorites(newFavorites);
  };

  const handleSaveSelections = async () => {
    if (!weeklyMenu || !user.id) return;
    
    setIsLoading(true);
    
    try {
      // Save all selections
      for (const [date, selectedItems] of Object.entries(selections)) {
        if (selectedItems.length > 0) {
          const selection: MealSelectionType = {
            id: `selection-${user.id}-${date}`,
            studentId: user.id,
            date,
            selectedItems,
            timestamp: new Date().toISOString()
          };
          storageService.saveMealSelection(selection);
        }
      }
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to save selections:', error);
      setIsLoading(false);
    }
  };

  const isItemCompatible = (item: MenuItem): boolean => {
    if (preferences.vegetarian && !item.dietaryTags.includes('vegetarian') && !item.dietaryTags.includes('vegan')) {
      return false;
    }
    if (preferences.vegan && !item.dietaryTags.includes('vegan')) {
      return false;
    }
    if (preferences.glutenFree && item.allergens.includes('gluten')) {
      return false;
    }
    if (preferences.dairyFree && item.allergens.includes('dairy')) {
      return false;
    }
    
    // Check allergens
    for (const allergen of preferences.allergens) {
      if (item.allergens.includes(allergen.toLowerCase())) {
        return false;
      }
    }
    
    return true;
  };

  const getFilteredItems = (items: MenuItem[]) => {
    let filtered = items;
    
    if (filterBy === 'compatible') {
      filtered = items.filter(isItemCompatible);
    } else if (filterBy === 'local') {
      filtered = items.filter(item => item.isLocal);
    } else if (filterBy === 'seasonal') {
      filtered = items.filter(item => item.isSeasonal);
    } else if (filterBy === 'favorites') {
      filtered = items.filter(item => favorites.has(item.id));
    } else if (filterBy === 'high-nutrition') {
      filtered = items.filter(item => item.nutritionScore >= 8);
    }
    
    return filtered;
  };

  if (!weeklyMenu) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-8xl mb-4">🍽️</div>
          <p className="text-3xl font-bold text-purple-600">Loading your amazing menu...</p>
        </div>
      </div>
    );
  }

  const currentDay = weeklyMenu.days[selectedDay];
  const daySelections = selections[currentDay.date] || [];
  const filteredItems = getFilteredItems(currentDay.items);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-50 to-green-100 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-4xl animate-bounce">🍎</div>
        <div className="absolute top-20 right-20 text-3xl animate-pulse">🥕</div>
        <div className="absolute bottom-20 left-20 text-3xl animate-bounce delay-1000">🍌</div>
        <div className="absolute bottom-10 right-10 text-4xl animate-pulse delay-500">🥗</div>
        <div className="absolute top-1/2 left-5 text-2xl animate-bounce delay-700">🍇</div>
        <div className="absolute top-1/3 right-5 text-2xl animate-pulse delay-300">🥪</div>
      </div>

      {/* Success Animation */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="text-center animate-bounce">
            <div className="text-8xl mb-4">🎉</div>
            <div className="text-4xl font-bold text-green-600 bg-white px-8 py-4 rounded-full shadow-lg border-4 border-green-300">
              Perfect choices! Saved! ✨
            </div>
          </div>
        </div>
      )}

      <div className="p-6 max-w-7xl mx-auto relative z-10">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-orange-300 via-yellow-300 to-green-300 rounded-3xl p-8 mb-8 shadow-xl border-4 border-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="text-8xl animate-bounce">🍽️</div>
              <div>
                <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-2">
                  Smart Meal Selection! 🌟
                </h1>
                <p className="text-xl text-white drop-shadow-md">
                  Choose meals that match your preferences and help our planet!
                </p>
              </div>
            </div>
            <div className="text-6xl animate-pulse">👨‍🍳</div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-3xl shadow-xl border-4 border-blue-300 mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Filter className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-800">Find Your Perfect Meals</h2>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-blue-500 text-white px-4 py-2 rounded-full font-bold hover:bg-blue-600 transition-colors"
              >
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                {[
                  { id: 'all', label: 'All Foods', icon: '🍽️' },
                  { id: 'compatible', label: 'Perfect for Me', icon: '✅' },
                  { id: 'local', label: 'Local Farms', icon: '🚜' },
                  { id: 'seasonal', label: 'Seasonal', icon: '🍂' },
                  { id: 'favorites', label: 'My Favorites', icon: '❤️' },
                  { id: 'high-nutrition', label: 'Super Healthy', icon: '💪' }
                ].map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setFilterBy(filter.id)}
                    className={`p-3 rounded-xl border-2 transition-all text-center ${
                      filterBy === filter.id
                        ? 'border-blue-500 bg-blue-100'
                        : 'border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    <div className="text-2xl mb-1">{filter.icon}</div>
                    <div className="text-sm font-bold text-gray-800">{filter.label}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Day Selector */}
        <div className="bg-white rounded-3xl shadow-xl border-4 border-yellow-300 mb-8">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-4xl">📅</div>
              <h2 className="text-3xl font-bold text-gray-800">Pick a Day to Plan</h2>
              <div className="text-4xl animate-bounce">⭐</div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {weeklyMenu.days.map((day, index) => {
                const dayName = format(new Date(day.date), 'EEEE');
                const dayDate = format(new Date(day.date), 'MMM d');
                const hasSelections = (selections[day.date] || []).length > 0;
                const dayEmojis = ['🌟', '🎈', '🌈', '🎯', '🎉'];
                
                return (
                  <button
                    key={day.id}
                    onClick={() => setSelectedDay(index)}
                    className={`p-6 rounded-2xl border-4 transition-all transform hover:scale-105 ${
                      selectedDay === index
                        ? 'border-blue-500 bg-blue-100 scale-105'
                        : 'border-gray-300 bg-white hover:border-yellow-400'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">{dayEmojis[index]}</div>
                      <p className="text-xl font-bold text-gray-800">{dayName}</p>
                      <p className="text-sm text-gray-600 mb-2">{dayDate}</p>
                      {hasSelections && (
                        <div className="flex items-center justify-center gap-1">
                          <Check className="w-4 h-4 text-green-500" />
                          <span className="text-xs text-green-600 font-bold">Picked!</span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Wildcard Item Spotlight */}
        {currentDay.wildcardItem && (
          <div className="bg-gradient-to-r from-purple-200 via-pink-200 to-yellow-200 rounded-3xl p-8 mb-8 border-4 border-purple-400 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-6xl animate-bounce">🌟</div>
              <div>
                <h2 className="text-3xl font-bold text-purple-800">Today's Wildcard Special!</h2>
                <p className="text-lg text-purple-700">Our AI chef picked this just for you!</p>
              </div>
              <div className="text-6xl animate-pulse">🎲</div>
            </div>

            <div className="bg-white rounded-2xl p-6 border-3 border-purple-300">
              <div className="flex items-start gap-6">
                <img
                  src={currentDay.wildcardItem.imageUrl}
                  alt={currentDay.wildcardItem.name}
                  className="w-32 h-32 object-cover rounded-xl border-2 border-purple-300"
                />
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{currentDay.wildcardItem.name}</h3>
                  <p className="text-gray-700 mb-4">{currentDay.wildcardItem.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {currentDay.wildcardItem.isLocal && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        Local Farm
                      </span>
                    )}
                    {currentDay.wildcardItem.isSeasonal && (
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-bold flex items-center gap-1">
                        <Leaf className="w-3 h-3" />
                        Seasonal
                      </span>
                    )}
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      AI Recommended
                    </span>
                  </div>

                  <button
                    onClick={() => handleItemToggle(currentDay.date, currentDay.wildcardItem!.id)}
                    className={`px-6 py-3 rounded-full font-bold text-lg transition-all transform hover:scale-105 ${
                      daySelections.includes(currentDay.wildcardItem.id)
                        ? 'bg-green-500 text-white'
                        : 'bg-purple-500 text-white hover:bg-purple-600'
                    }`}
                  >
                    {daySelections.includes(currentDay.wildcardItem.id) ? '✅ Added!' : '🌟 Try This!'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Special Messages */}
        {currentDay.specialMessage && (
          <div className="bg-gradient-to-r from-pink-200 to-purple-200 rounded-2xl p-6 mb-8 border-4 border-pink-300 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="text-4xl animate-bounce">✨</div>
              <p className="text-xl font-bold text-purple-800">
                {currentDay.specialMessage}
              </p>
              <div className="text-4xl animate-pulse">🎊</div>
            </div>
          </div>
        )}

        {currentDay.seasonalHighlight && (
          <div className="bg-gradient-to-r from-green-200 to-yellow-200 rounded-2xl p-6 mb-8 border-4 border-green-300 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="text-4xl animate-bounce">🍂</div>
              <p className="text-xl font-bold text-green-800">
                {currentDay.seasonalHighlight}
              </p>
              <div className="text-4xl animate-pulse">🌾</div>
            </div>
          </div>
        )}

        {/* Enhanced Food Selection Grid */}
        <div className="bg-white rounded-3xl shadow-xl border-4 border-green-300 mb-8">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="text-4xl">🍴</div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">
                    {format(new Date(currentDay.date), 'EEEE')} Menu
                  </h2>
                  <p className="text-lg text-gray-600">
                    {filteredItems.length} delicious options available!
                  </p>
                </div>
              </div>
              <div className="text-center bg-yellow-100 rounded-2xl p-4 border-2 border-yellow-300">
                <div className="text-2xl font-bold text-yellow-800">{daySelections.length}</div>
                <div className="text-sm text-yellow-600">foods picked</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => {
                const isSelected = daySelections.includes(item.id);
                const isCompatible = isItemCompatible(item);
                const isFavorite = favorites.has(item.id);
                const userRating = ratings[item.id] || 0;
                
                const categoryColors = {
                  'protein': 'from-red-300 to-red-400 border-red-400',
                  'vegetable': 'from-green-300 to-green-400 border-green-400',
                  'grain': 'from-yellow-300 to-yellow-400 border-yellow-400',
                  'fruit': 'from-purple-300 to-purple-400 border-purple-400',
                  'dairy': 'from-blue-300 to-blue-400 border-blue-400'
                };
                
                const categoryEmojis = {
                  'protein': '🥩',
                  'vegetable': '🥬',
                  'grain': '🌾',
                  'fruit': '🍎',
                  'dairy': '🥛'
                };
                
                return (
                  <div
                    key={item.id}
                    className={`border-4 rounded-3xl p-6 transition-all cursor-pointer transform hover:scale-105 ${
                      isSelected
                        ? 'border-green-500 bg-green-100 scale-105 shadow-xl'
                        : isCompatible
                        ? 'border-gray-300 bg-white hover:border-yellow-400 shadow-lg'
                        : 'border-red-300 bg-red-50 opacity-75'
                    } ${clickedItem === item.id ? 'scale-95' : ''}`}
                    onClick={() => isCompatible && handleItemToggle(currentDay.date, item.id)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-800 flex-1">{item.name}</h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFavoriteToggle(item.id);
                          }}
                          className={`p-1 rounded-full transition-all ${
                            isFavorite ? 'text-red-500 scale-110' : 'text-gray-400 hover:text-red-500'
                          }`}
                        >
                          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                        </button>
                        <div className={`p-2 rounded-full transition-all ${
                          isSelected ? 'bg-green-500 scale-110' : 'bg-gray-200'
                        }`}>
                          {isSelected ? (
                            <Check className="w-6 h-6 text-white" />
                          ) : (
                            <div className="w-6 h-6" />
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-40 object-cover rounded-2xl mb-4 border-2 border-gray-200"
                    />
                    
                    <p className="text-gray-700 mb-4 text-lg leading-relaxed">{item.description}</p>
                    
                    {/* Special Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {item.isLocal && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          Local
                        </span>
                      )}
                      {item.isSeasonal && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold flex items-center gap-1">
                          <Leaf className="w-3 h-3" />
                          Seasonal
                        </span>
                      )}
                      {!isCompatible && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                          ⚠️ Check ingredients
                        </span>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center mb-3">
                      <div className={`px-4 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r ${categoryColors[item.category]} border-2`}>
                        <span className="mr-1">{categoryEmojis[item.category]}</span>
                        {item.category}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <span className="text-lg font-bold text-gray-700">{item.nutritionScore}/10</span>
                      </div>
                    </div>

                    {/* Nutrition Info */}
                    <div className="bg-gray-100 rounded-xl p-3 mb-3">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div><span className="font-bold">Calories:</span> {item.calories}</div>
                        <div><span className="font-bold">Protein:</span> {item.protein}g</div>
                        <div><span className="font-bold">Carbs:</span> {item.carbs}g</div>
                        <div><span className="font-bold">Fiber:</span> {item.fiber}g</div>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-gray-700">Rate this meal:</span>
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRating(item.id, userRating === 1 ? 0 : 1);
                          }}
                          className={`p-1 rounded ${userRating >= 1 ? 'text-green-500' : 'text-gray-300'}`}
                        >
                          <ThumbsUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRating(item.id, userRating === -1 ? 0 : -1);
                          }}
                          className={`p-1 rounded ${userRating === -1 ? 'text-red-500' : 'text-gray-300'}`}
                        >
                          <ThumbsDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {item.allergens.length > 0 && (
                      <div className="mt-3 p-3 bg-orange-100 rounded-xl border-2 border-orange-300">
                        <p className="text-sm font-bold text-orange-800">
                          ⚠️ Contains: {item.allergens.join(', ')}
                        </p>
                      </div>
                    )}

                    {isSelected && (
                      <div className="mt-3 p-3 bg-green-100 rounded-xl border-2 border-green-300 animate-pulse">
                        <p className="text-sm font-bold text-green-800 text-center">
                          🎉 Great choice! Added to your meal!
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="text-center">
          <button
            onClick={handleSaveSelections}
            disabled={isLoading}
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-12 py-6 rounded-full text-2xl font-bold hover:scale-110 focus:ring-4 focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl border-4 border-white flex items-center gap-4 mx-auto"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-white"></div>
                Saving Your Perfect Choices...
              </>
            ) : (
              <>
                <ChefHat className="w-8 h-8" />
                Save My Smart Choices! 
                <div className="text-3xl">🎉</div>
              </>
            )}
          </button>
          
          <p className="text-lg text-gray-600 mt-4 font-medium">
            You can update your choices anytime before Sunday! 😊
          </p>
        </div>

        {/* Friendly Helper */}
        <div className="fixed bottom-6 right-6 z-20">
          <div className="bg-orange-400 rounded-full p-4 shadow-xl border-4 border-white cursor-pointer hover:scale-110 transform transition-all animate-bounce">
            <div className="text-4xl">🤖</div>
          </div>
          <div className="absolute bottom-20 right-0 bg-white rounded-2xl p-4 shadow-lg border-2 border-orange-400 max-w-xs opacity-0 hover:opacity-100 transition-opacity">
            <p className="text-sm font-bold text-gray-800">Hi! I'm Chef Bot! 🤖</p>
            <p className="text-xs text-gray-600 mt-1">I help you pick the perfect meals based on what you like!</p>
          </div>
        </div>
      </div>
    </div>
  );
};