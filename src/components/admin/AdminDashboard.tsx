import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, TrendingDown, Calendar, Target } from 'lucide-react';
import { User, WasteMetrics } from '../../types';
import { storageService } from '../../utils/storage';

interface AdminDashboardProps {
  user: User;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [wasteMetrics, setWasteMetrics] = useState<WasteMetrics[]>([]);

  useEffect(() => {
    // Generate demo waste metrics
    const generateDemoMetrics = () => {
      const metrics: WasteMetrics[] = [];
      const today = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        
        metrics.push({
          date: date.toISOString().split('T')[0],
          totalStudents: 150 + Math.floor(Math.random() * 20),
          totalMeals: 450 + Math.floor(Math.random() * 50),
          wasteByCategory: {
            'protein': Math.floor(Math.random() * 30) + 10,
            'vegetable': Math.floor(Math.random() * 40) + 20,
            'grain': Math.floor(Math.random() * 25) + 15,
            'fruit': Math.floor(Math.random() * 20) + 10,
            'dairy': Math.floor(Math.random() * 15) + 5
          },
          wasteByLevel: {
            'none': Math.floor(Math.random() * 100) + 200,
            'little': Math.floor(Math.random() * 80) + 100,
            'half': Math.floor(Math.random() * 60) + 80,
            'most': Math.floor(Math.random() * 40) + 40,
            'all': Math.floor(Math.random() * 20) + 10
          },
          averageWastePerStudent: Math.random() * 0.3 + 0.1
        });
      }
      
      return metrics;
    };

    const metrics = generateDemoMetrics();
    setWasteMetrics(metrics);
    
    // Update storage with latest metrics
    metrics.forEach(metric => {
      storageService.updateWasteMetrics(metric);
    });
  }, []);

  const totalStudents = wasteMetrics.length > 0 ? wasteMetrics[wasteMetrics.length - 1].totalStudents : 0;
  const totalMeals = wasteMetrics.reduce((sum, metric) => sum + metric.totalMeals, 0);
  const avgWasteReduction = wasteMetrics.length > 0 
    ? ((1 - wasteMetrics[wasteMetrics.length - 1].averageWastePerStudent) * 100).toFixed(1)
    : '0';

  // Prepare chart data
  const wasteChartData = wasteMetrics.map(metric => ({
    date: new Date(metric.date).toLocaleDateString('en-US', { weekday: 'short' }),
    waste: metric.averageWastePerStudent * 100
  }));

  const categoryData = wasteMetrics.length > 0 
    ? Object.entries(wasteMetrics[wasteMetrics.length - 1].wasteByCategory).map(([category, value]) => ({
        name: category,
        value,
        fill: {
          'protein': '#ef4444',
          'vegetable': '#22c55e',
          'grain': '#eab308',
          'fruit': '#a855f7',
          'dairy': '#3b82f6'
        }[category] || '#6b7280'
      }))
    : [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Admin Dashboard 📊
        </h1>
        <p className="text-gray-600">
          Monitor food waste metrics and student engagement across NYC schools.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Active Students</p>
              <p className="text-3xl font-bold">{totalStudents}</p>
            </div>
            <Users className="w-10 h-10 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Waste Reduction</p>
              <p className="text-3xl font-bold">{avgWasteReduction}%</p>
            </div>
            <TrendingDown className="w-10 h-10 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Total Meals</p>
              <p className="text-3xl font-bold">{totalMeals.toLocaleString()}</p>
            </div>
            <Calendar className="w-10 h-10 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Program Goal</p>
              <p className="text-3xl font-bold">25%</p>
            </div>
            <Target className="w-10 h-10 text-orange-200" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Waste Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Weekly Waste Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={wasteChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis label={{ value: 'Waste %', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => [`${value}%`, 'Waste Level']} />
              <Bar dataKey="waste" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Waste by Category */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Waste by Food Category
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {[
            { time: '2 hours ago', action: 'Menu updated for next week', user: 'Kitchen Staff', type: 'menu' },
            { time: '4 hours ago', action: '25 students completed waste tracking', user: 'System', type: 'tracking' },
            { time: '6 hours ago', action: 'Weekly report generated', user: 'Admin', type: 'report' },
            { time: '1 day ago', action: 'New achievement unlocked by 15 students', user: 'System', type: 'achievement' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  activity.type === 'menu' ? 'bg-blue-500' :
                  activity.type === 'tracking' ? 'bg-green-500' :
                  activity.type === 'report' ? 'bg-purple-500' :
                  'bg-yellow-500'
                }`}></div>
                <div>
                  <p className="text-gray-800 font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-600">by {activity.user}</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};