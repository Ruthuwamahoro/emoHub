'use client'
import React, { useEffect, useMemo, useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  UsersIcon, 
  Heart, 
  BookOpen, 
  Calendar 
} from 'lucide-react';
import EmotionGauge from '@/components/Dashboard/emotions/EmotionsTracker';
import { useSession } from 'next-auth/react';


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
  trend?: number;
}

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
  const [emoji, setEmoji] = useState('')
  const [greeting, setGreeting] = useState('');


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const simulatedData: DashboardMetrics = {
          reflections: 24,
          groups: 34,
          emotionalCheckIns: 18,
          resources: 4,
          users: 21,
          activeEvents: 8,
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

  useEffect(() => {
    const getTimeBasedGreeting = () => {
      const currentHour = new Date().getHours();
      
      if (currentHour >= 5 && currentHour < 12) {
        setGreeting('Good morning');
        setEmoji('🌅');
      } else if (currentHour >= 12 && currentHour < 17) {
        setGreeting('Good afternoon');
        setEmoji('☀️');
      } else if (currentHour >= 17 && currentHour < 21) {
        setGreeting('Good evening');
        setEmoji('🌆');
      } else {
        setGreeting('Good night');
        setEmoji('🌙');
      }
    };

    getTimeBasedGreeting();
    
    const interval = setInterval(getTimeBasedGreeting, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const { data: session } = useSession();
  const fullName = useMemo(() => 
    session?.user?.fullName?.split(" ")[0] || '', 
    [session?.user?.fullName]
  );  

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
          <p className="h-1 w-20 bg-slate-500 mb-8"></p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-2xl font-bold tracking-tight leading-tight">
                <span className="bg-gradient-to-r from-black via-amber-600 to-amber-600 bg-clip-text text-transparent font-bold">
                  {greeting},
                </span>
                <br />
                <span className="text-slate-800 font-bold">{fullName || 'Friend'}!</span>
              </h1>
          <p></p>
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
            trend={1}
          />
          <StatCard
            title="Groups"
            value={metrics.groups}
            icon={<UsersIcon />}
            trend={3}
          />
          <StatCard
            title="Emotional Check-ins"
            value={metrics.emotionalCheckIns}
            icon={<Heart />}
            trend={5}
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
            trend={20}
          />
          <StatCard
            title="Active Events"
            value={metrics.activeEvents}
            icon={<Calendar />}
            trend={2}
          />
        </div>
      </div>
      <div className="mb-8 sm:mb-9 lg:mb-10 mt-20">
          <EmotionGauge />
      </div>
    </div>
  );
};

export default AdminDashboard;
