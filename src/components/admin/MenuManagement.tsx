import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { User, WeeklyMenu, DailyMenu, MenuItem } from '../../types';
import { storageService } from '../../utils/storage';
import { format, addDays, startOfWeek } from 'date-fns';

interface MenuManagementProps {
  user: User;
}

export const MenuManagement: React.FC<MenuManagementProps> = ({ user }) => {
  const [weeklyMenu, setWeeklyMenu] = useState<WeeklyMenu | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);

  useEffect(() => {
    const menu = storageService.getWeeklyMenu();
    if (menu) {
      setWeeklyMenu(menu);
    } else {
      // Create a new menu for this week
      createNewWeeklyMenu();
    }
  }, []);

  const createNewWeeklyMenu = () => {
    const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
    const days: DailyMenu[] = [];
    
    for (let i = 0; i < 5; i++) {
      days.push({
        id: `day-${i}`,
        date: format(addDays(startDate, i), 'yyyy-MM-dd'),
        items: [],
        specialMessage: ''
      });
    }

    const newMenu: WeeklyMenu = {
      id: `week-${Date.now()}`,
      weekOf: format(startDate, 'yyyy-MM-dd'),
      days
    };

    setWeeklyMenu(newMenu);
    storageService.saveWeeklyMenu(newMenu);
  };

  const handleAddItem = (newItem: Omit<MenuItem, 'id'>) => {
    if (!weeklyMenu) return;

    const item: MenuItem = {
      ...newItem,
      id: `item-${Date.now()}`
    };

    const updatedMenu = { ...weeklyMenu };
    updatedMenu.days[selectedDay].items.push(item);
    
    setWeeklyMenu(updatedMenu);
    storageService.saveWeeklyMenu(updatedMenu);
    setIsAddingItem(false);
  };

  const handleEditItem = (updatedItem: MenuItem) => {
    if (!weeklyMenu) return;

    const updatedMenu = { ...weeklyMenu };
    const dayItems = updatedMenu.days[selectedDay].items;
    const itemIndex = dayItems.findIndex(item => item.id === updatedItem.id);
    
    if (itemIndex !== -1) {
      dayItems[itemIndex] = updatedItem;
      setWeeklyMenu(updatedMenu);
      storageService.saveWeeklyMenu(updatedMenu);
    }
    
    setEditingItem(null);
  };

  const handleDeleteItem = (itemId: string) => {
    if (!weeklyMenu) return;

    const updatedMenu = { ...weeklyMenu };
    updatedMenu.days[selectedDay].items = updatedMenu.days[selectedDay].items.filter(
      item => item.id !== itemId
    );
    
    setWeeklyMenu(updatedMenu);
    storageService.saveWeeklyMenu(updatedMenu);
  };

  const handleSpecialMessageUpdate = (message: string) => {
    if (!weeklyMenu) return;

    const updatedMenu = { ...weeklyMenu };
    updatedMenu.days[selectedDay].specialMessage = message;
    
    setWeeklyMenu(updatedMenu);
    storageService.saveWeeklyMenu(updatedMenu);
  };

  if (!weeklyMenu) {
    return <div className="p-6">Loading menu management...</div>;
  }

  const currentDay = weeklyMenu.days[selectedDay];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Menu Management 🍽️
        </h1>
        <p className="text-gray-600">
          Manage weekly menus for all participating schools.
        </p>
      </div>

      {/* Day Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Day to Edit</h2>
          <div className="grid grid-cols-5 gap-4">
            {weeklyMenu.days.map((day, index) => {
              const dayName = format(new Date(day.date), 'EEEE');
              const dayDate = format(new Date(day.date), 'MMM d');
              
              return (
                <button
                  key={day.id}
                  onClick={() => setSelectedDay(index)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedDay === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <p className="font-medium text-gray-800">{dayName}</p>
                    <p className="text-sm text-gray-600">{dayDate}</p>
                    <p className="text-xs text-blue-600 mt-1">
                      {day.items.length} items
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Special Message */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Special Message for {format(new Date(currentDay.date), 'EEEE')}
          </h2>
          <input
            type="text"
            value={currentDay.specialMessage || ''}
            onChange={(e) => handleSpecialMessageUpdate(e.target.value)}
            placeholder="Add a special message for this day (optional)"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Menu Items */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Menu Items - {format(new Date(currentDay.date), 'EEEE, MMMM d')}
            </h2>
            <button
              onClick={() => setIsAddingItem(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentDay.items.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="text-blue-600 hover:text-blue-700"
                      aria-label="Edit item"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-red-600 hover:text-red-700"
                      aria-label="Delete item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                
                <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                
                <div className="flex justify-between items-center text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    item.category === 'protein' ? 'bg-red-100 text-red-700' :
                    item.category === 'vegetable' ? 'bg-green-100 text-green-700' :
                    item.category === 'grain' ? 'bg-yellow-100 text-yellow-700' :
                    item.category === 'fruit' ? 'bg-purple-100 text-purple-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {item.category}
                  </span>
                  <span className="text-gray-600">Score: {item.nutritionScore}/10</span>
                </div>
                
                {item.allergens.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-xs text-orange-600">
                      Allergens: {item.allergens.join(', ')}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add/Edit Item Modal */}
      {(isAddingItem || editingItem) && (
        <ItemFormModal
          item={editingItem}
          onSave={editingItem ? handleEditItem : handleAddItem}
          onCancel={() => {
            setIsAddingItem(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
};

interface ItemFormModalProps {
  item?: MenuItem | null;
  onSave: (item: any) => void;
  onCancel: () => void;
}

const ItemFormModal: React.FC<ItemFormModalProps> = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    category: item?.category || 'protein',
    description: item?.description || '',
    allergens: item?.allergens.join(', ') || '',
    nutritionScore: item?.nutritionScore || 5,
    imageUrl: item?.imageUrl || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    available: item?.available ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const itemData = {
      ...formData,
      allergens: formData.allergens.split(',').map(a => a.trim()).filter(a => a),
      id: item?.id
    };
    
    onSave(itemData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {item ? 'Edit Menu Item' : 'Add Menu Item'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="protein">Protein</option>
                <option value="vegetable">Vegetable</option>
                <option value="grain">Grain</option>
                <option value="fruit">Fruit</option>
                <option value="dairy">Dairy</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Allergens (comma-separated)
              </label>
              <input
                type="text"
                value={formData.allergens}
                onChange={(e) => setFormData(prev => ({ ...prev, allergens: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="gluten, dairy, nuts"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nutrition Score (1-10)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.nutritionScore}
                onChange={(e) => setFormData(prev => ({ ...prev, nutritionScore: parseInt(e.target.value) }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {item ? 'Update Item' : 'Add Item'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};