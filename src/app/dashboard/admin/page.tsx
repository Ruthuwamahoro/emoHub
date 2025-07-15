'use client'
import React, { useEffect, useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  UsersIcon, 
  Heart, 
  BookOpen, 
  Calendar 
} from 'lucide-react';
import EmotionGauge from '@/components/Dashboard/emotions/EmotionsTracker';


// Types for dashboard metrics
interface DashboardMetrics {
  reflections: number;
  groups: number;
  emotionalCheckIns: number;
  resources: number;
  users: number;
  activeEvents: number;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: number; // Optional trend percentage
}

// Reusable StatCard component
const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
          {trend !== undefined && (
            <p className={`text-sm mt-2 ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trend >= 0 ? '↗' : '↘'} {Math.abs(trend)}% from last period
            </p>
          )}
        </div>
        <div className="flex-shrink-0 ml-4">
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
            <div className="text-blue-600 w-6 h-6">
              {icon}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Admin Dashboard component
const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    reflections: 0,
    groups: 0,
    emotionalCheckIns: 0,
    resources: 0,
    users: 0,
    activeEvents: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate API data fetching
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // TODO: Replace with actual API call
        // const response = await fetch('/api/dashboard/metrics');
        // const data = await response.json();
        
        // Simulated API response with realistic data
        const simulatedData: DashboardMetrics = {
          reflections: 1247,
          groups: 34,
          emotionalCheckIns: 892,
          resources: 156,
          users: 2341,
          activeEvents: 12,
        };
        
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setMetrics(simulatedData);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-64 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-96"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Overview of your platform's key metrics and performance indicators
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Reflections"
            value={metrics.reflections}
            icon={<MessageSquare />}
            trend={12}
          />
          <StatCard
            title="Groups"
            value={metrics.groups}
            icon={<UsersIcon />}
            trend={5}
          />
          <StatCard
            title="Emotional Check-ins"
            value={metrics.emotionalCheckIns}
            icon={<Heart />}
            trend={8}
          />
          <StatCard
            title="Resources"
            value={metrics.resources}
            icon={<BookOpen />}
            trend={-2}
          />
          <StatCard
            title="Total Users"
            value={metrics.users}
            icon={<Users />}
            trend={15}
          />
          <StatCard
            title="Active Events"
            value={metrics.activeEvents}
            icon={<Calendar />}
            trend={3}
          />
        </div>

        {/* Additional Dashboard Content Placeholder */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <p className="text-gray-600">
            Additional dashboard components like charts, recent activities, or detailed analytics can be added here.
          </p>
        </div>
      </div>
      <div className="mb-8 sm:mb-9 lg:mb-10 mt-20">
          <EmotionGauge />
        </div>
    </div>
  );
};

export default AdminDashboard;
