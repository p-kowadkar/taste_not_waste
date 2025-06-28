import React, { useState, useEffect } from 'react';
import { BookOpen, Lightbulb, Leaf, Heart } from 'lucide-react';
import { User, EducationalContent } from '../../types';
import { storageService } from '../../utils/storage';

interface EducationProps {
  user: User;
}

export const Education: React.FC<EducationProps> = ({ user }) => {
  const [content, setContent] = useState<EducationalContent[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedContent, setSelectedContent] = useState<EducationalContent | null>(null);

  useEffect(() => {
    const educationalContent = storageService.getEducationalContent();
    
    // Add more demo content
    const extendedContent: EducationalContent[] = [
      ...educationalContent,
      {
        id: 'nutrition-2',
        title: 'The Power of Protein',
        content: 'Protein helps build strong muscles! You can find protein in chicken, fish, beans, and nuts. Try to include protein in every meal to help your body grow.',
        imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        category: 'nutrition',
        ageGroup: 'grades-3-5'
      },
      {
        id: 'nutrition-3',
        title: 'Colorful Fruits and Vegetables',
        content: 'Eating fruits and vegetables of different colors gives your body different vitamins! Red apples, orange carrots, green broccoli - each color helps your body in a special way.',
        imageUrl: 'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg',
        category: 'nutrition',
        ageGroup: 'grades-3-5'
      },
      {
        id: 'environment-2',
        title: 'Food Waste and Water',
        content: 'Did you know it takes lots of water to grow food? When we waste food, we also waste the water that was used to grow it. By finishing our meals, we help save water!',
        imageUrl: 'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg',
        category: 'environment',
        ageGroup: 'grades-3-5'
      },
      {
        id: 'fun-facts-1',
        title: 'Amazing Food Facts',
        content: 'Fun fact: A cow produces enough milk in one year to fill up about 400 bathtubs! And did you know that honey never spoils? Archaeologists have found honey in ancient tombs that\'s still good to eat!',
        imageUrl: 'https://images.pexels.com/photos/533342/pexels-photo-533342.jpeg',
        category: 'fun-facts',
        ageGroup: 'grades-3-5'
      },
      {
        id: 'fun-facts-2',
        title: 'Super Seeds',
        content: 'Seeds are amazing! A tiny sunflower seed can grow into a plant that\'s taller than you! Seeds contain everything needed to grow a whole plant - they\'re like nature\'s magic packets.',
        imageUrl: 'https://images.pexels.com/photos/1556691/pexels-photo-1556691.jpeg',
        category: 'fun-facts',
        ageGroup: 'grades-3-5'
      }
    ];
    
    setContent(extendedContent);
  }, []);

  const categories = [
    { id: 'all', label: 'All Topics', icon: BookOpen },
    { id: 'nutrition', label: 'Nutrition', icon: Heart },
    { id: 'environment', label: 'Environment', icon: Leaf },
    { id: 'fun-facts', label: 'Fun Facts', icon: Lightbulb }
  ];

  const filteredContent = selectedCategory === 'all' 
    ? content 
    : content.filter(item => item.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'nutrition': return 'bg-red-100 text-red-700';
      case 'environment': return 'bg-green-100 text-green-700';
      case 'fun-facts': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Learn About Food & Nutrition 📚
        </h1>
        <p className="text-gray-600">
          Discover amazing facts about food, nutrition, and how you can help our planet!
        </p>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Choose a Topic</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedCategory === category.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                aria-pressed={selectedCategory === category.id}
              >
                <div className="text-center">
                  <Icon className={`w-8 h-8 mx-auto mb-2 ${
                    selectedCategory === category.id ? 'text-blue-600' : 'text-gray-500'
                  }`} />
                  <p className={`font-medium text-sm ${
                    selectedCategory === category.id ? 'text-blue-800' : 'text-gray-700'
                  }`}>
                    {category.label}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContent.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedContent(item)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setSelectedContent(item);
              }
            }}
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                  {item.title}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                  {item.category === 'fun-facts' ? 'Fun' : item.category}
                </span>
              </div>
              <p className="text-gray-600 text-sm line-clamp-3">
                {item.content}
              </p>
              <button className="mt-4 text-blue-600 text-sm font-medium hover:text-blue-700">
                Read more →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Content Modal */}
      {selectedContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selectedContent.imageUrl}
                alt={selectedContent.title}
                className="w-full h-64 object-cover"
              />
              <button
                onClick={() => setSelectedContent(null)}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedContent.title}
                </h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedContent.category)}`}>
                  {selectedContent.category === 'fun-facts' ? 'Fun Facts' : selectedContent.category}
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                {selectedContent.content}
              </p>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setSelectedContent(null)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Got it! 👍
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Daily Tip */}
      <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-yellow-500" />
          Today's Tip
        </h2>
        <p className="text-gray-700">
          Try to eat a "rainbow" of foods today! Different colored fruits and vegetables give your body different nutrients. 
          Red tomatoes, orange carrots, yellow peppers, green lettuce, and purple grapes all help you grow strong! 🌈
        </p>
      </div>
    </div>
  );
};