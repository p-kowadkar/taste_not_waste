import React, { useState, useEffect } from 'react';
import { Calendar, Check, X, Clock, ChefHat, Star, Heart } from 'lucide-react';
import { User, WeeklyMenu, DailyMenu, MenuItem, MealSelection as MealSelectionType } from '../../types';
import { storageService } from '../../utils/storage';
import { format, addDays, startOfWeek } from 'date-fns';

interface MealSelectionProps {
  user: User;
}

// Generate demo menu data with fun descriptions
const generateDemoMenu = (): WeeklyMenu => {
  const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
  
  const demoItems: MenuItem[] = [
    {
      id: 'pizza-1',
      name: 'Super Cheese Pizza',
      category: 'protein',
      description: 'Yummy melted cheese on crispy whole wheat crust! 🍕',
      allergens: ['gluten', 'dairy'],
      nutritionScore: 7,
      imageUrl: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg',
      available: true
    },
    {
      id: 'salad-1',
      name: 'Rainbow Garden Salad',
      category: 'vegetable',
      description: 'Crunchy lettuce, juicy tomatoes, and cool cucumbers! 🥗',
      allergens: [],
      nutritionScore: 9,
      imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      available: true
    },
    {
      id: 'chicken-1',
      name: 'Hero Chicken Strips',
      category: 'protein',
      description: 'Tender, juicy chicken strips with magical herbs! 🍗',
      allergens: [],
      nutritionScore: 8,
      imageUrl: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg',
      available: true
    },
    {
      id: 'rice-1',
      name: 'Power-Up Brown Rice',
      category: 'grain',
      description: 'Super healthy brown rice that gives you energy! 🍚',
      allergens: [],
      nutritionScore: 8,
      imageUrl: 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg',
      available: true
    },
    {
      id: 'fruit-1',
      name: 'Magic Apple Slices',
      category: 'fruit',
      description: 'Sweet, crunchy apple slices that make you smile! 🍎',
      allergens: [],
      nutritionScore: 9,
      imageUrl: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg',
      available: true
    },
    {
      id: 'sandwich-1',
      name: 'Adventure Turkey Sandwich',
      category: 'protein',
      description: 'Tasty turkey with fresh veggies on soft bread! 🥪',
      allergens: ['gluten'],
      nutritionScore: 8,
      imageUrl: 'https://images.pexels.com/photos/1603901/pexels-photo-1603901.jpeg',
      available: true
    }
  ];

  const days: DailyMenu[] = [];
  const specialMessages = [
    "🌟 Today's special: Farm-fresh vegetables straight from the garden!",
    "🎉 Taco Tuesday! Try our amazing veggie tacos!",
    "🥗 Salad Wednesday! Mix and match your favorite toppings!",
    "🍕 Pizza Thursday! Made with love and healthy ingredients!",
    "🎈 Fun Friday! Special treats for finishing the week strong!"
  ];

  for (let i = 0; i < 5; i++) {
    days.push({
      id: `day-${i}`,
      date: format(addDays(startDate, i), 'yyyy-MM-dd'),
      items: demoItems,
      specialMessage: specialMessages[i]
    });
  }

  return {
    id: 'week-1',
    weekOf: format(startDate, 'yyyy-MM-dd'),
    days
  };
};

export const MealSelection: React.FC<MealSelectionProps> = ({ user }) => {
  const [weeklyMenu, setWeeklyMenu] = useState<WeeklyMenu | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [clickedItem, setClickedItem] = useState<string | null>(null);

  useEffect(() => {
    // Load or generate demo menu
    let menu = storageService.getWeeklyMenu();
    if (!menu) {
      menu = generateDemoMenu();
      storageService.saveWeeklyMenu(menu);
    }
    setWeeklyMenu(menu);

    // Load existing selections
    if (user.id) {
      const userSelections = storageService.getMealSelections(user.id);
      const selectionMap: Record<string, string[]> = {};
      userSelections.forEach(selection => {
        selectionMap[selection.date] = selection.selectedItems;
      });
      setSelections(selectionMap);
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

  if (!weeklyMenu) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-8xl mb-4">🍽️</div>
          <p className="text-3xl font-bold text-purple-600">Loading your yummy menu...</p>
        </div>
      </div>
    );
  }

  const currentDay = weeklyMenu.days[selectedDay];
  const daySelections = selections[currentDay.date] || [];

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
              Great choices! Saved! ✨
            </div>
          </div>
        </div>
      )}

      <div className="p-6 max-w-6xl mx-auto relative z-10">
        {/* Fun Header */}
        <div className="bg-gradient-to-r from-orange-300 via-yellow-300 to-green-300 rounded-3xl p-8 mb-8 shadow-xl border-4 border-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="text-8xl animate-bounce">🍽️</div>
              <div>
                <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-2">
                  Pick Your Yummy Food! 🌟
                </h1>
                <p className="text-xl text-white drop-shadow-md">
                  Choose what makes your tummy happy this week!
                </p>
              </div>
            </div>
            <div className="text-6xl animate-pulse">👨‍🍳</div>
          </div>
        </div>

        {/* Day Selector - Fun Calendar */}
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
                    aria-pressed={selectedDay === index}
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

        {/* Special Message */}
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

        {/* Food Selection Grid */}
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
                    Tap the foods you want to eat! 
                  </p>
                </div>
              </div>
              <div className="text-center bg-yellow-100 rounded-2xl p-4 border-2 border-yellow-300">
                <div className="text-2xl font-bold text-yellow-800">{daySelections.length}</div>
                <div className="text-sm text-yellow-600">foods picked</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentDay.items.map((item) => {
                const isSelected = daySelections.includes(item.id);
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
                        : 'border-gray-300 bg-white hover:border-yellow-400 shadow-lg'
                    } ${clickedItem === item.id ? 'scale-95' : ''}`}
                    onClick={() => handleItemToggle(currentDay.date, item.id)}
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={0}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleItemToggle(currentDay.date, item.id);
                      }
                    }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
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
                    
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-40 object-cover rounded-2xl mb-4 border-2 border-gray-200"
                    />
                    
                    <p className="text-gray-700 mb-4 text-lg leading-relaxed">{item.description}</p>
                    
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
                Saving Your Choices...
              </>
            ) : (
              <>
                <ChefHat className="w-8 h-8" />
                Save My Yummy Choices! 
                <div className="text-3xl">🎉</div>
              </>
            )}
          </button>
          
          <p className="text-lg text-gray-600 mt-4 font-medium">
            Don't worry - you can change your mind anytime before Sunday! 😊
          </p>
        </div>

        {/* Friendly Helper */}
        <div className="fixed bottom-6 right-6 z-20">
          <div className="bg-orange-400 rounded-full p-4 shadow-xl border-4 border-white cursor-pointer hover:scale-110 transform transition-all animate-bounce">
            <div className="text-4xl">🐱</div>
          </div>
          <div className="absolute bottom-20 right-0 bg-white rounded-2xl p-4 shadow-lg border-2 border-orange-400 max-w-xs opacity-0 hover:opacity-100 transition-opacity">
            <p className="text-sm font-bold text-gray-800">Hi! I'm Whiskers the Food Helper! 🐱</p>
            <p className="text-xs text-gray-600 mt-1">Pick foods that make you happy and healthy!</p>
          </div>
        </div>
      </div>
    </div>
  );
};