'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { HealthMetricCard } from './HealthMetricCard';
import { HealthChat } from './HealthChat';
import { HealthData } from '@/types/health';
import { 
  Activity, 
  Flame, 
  Heart, 
  Moon, 
  RefreshCw,
  TrendingUp,
  Lightbulb,
  LogOut,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface HealthDashboardProps {
  onSignOut?: () => void;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export function HealthDashboard({ onSignOut, user }: HealthDashboardProps) {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<string>('');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHealthData = async () => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/health/data?type=all&days=7');
      const data = await response.json();

      if (response.ok && data.data) {
        setHealthData(data.data);
        setLastUpdate(new Date(data.timestamp));
      } else {
        console.error('Failed to fetch health data:', data.error);
      }
    } catch (error) {
      console.error('Error fetching health data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchHealthSummary = async () => {
    try {
      const response = await fetch('/api/health/summary?period=week');
      const data = await response.json();

      if (response.ok) {
        setSummary(data.summary);
      }
    } catch (error) {
      console.error('Error fetching health summary:', error);
    }
  };

  useEffect(() => {
    fetchHealthData();
    fetchHealthSummary();
  }, []);

  const handleRefresh = () => {
    fetchHealthData();
    fetchHealthSummary();
  };

  // Calculate metrics for display
  const calculateMetrics = () => {
    if (!healthData) return null;

    const today = new Date().toISOString().split('T')[0];
    
    // Get latest values
    const latestSteps = healthData.steps.find(s => s.date === today)?.value || 
                       healthData.steps[healthData.steps.length - 1]?.value || 0;
    const latestCalories = healthData.calories.find(c => c.date === today)?.value || 
                          healthData.calories[healthData.calories.length - 1]?.value || 0;
    const latestHeartRate = healthData.heart_rate.find(hr => hr.date === today)?.value || 
                           healthData.heart_rate[healthData.heart_rate.length - 1]?.value || 0;
    const latestSleep = healthData.sleep.find(s => s.date === today)?.value || 
                       healthData.sleep[healthData.sleep.length - 1]?.value || 0;

    // Calculate averages for comparison
    const avgSteps = healthData.steps.reduce((sum, s) => sum + s.value, 0) / healthData.steps.length;
    const avgCalories = healthData.calories.reduce((sum, c) => sum + c.value, 0) / healthData.calories.length;

    return {
      steps: {
        current: latestSteps,
        target: 10000,
        progress: Math.min(latestSteps / 10000, 1),
        change: latestSteps - avgSteps
      },
      calories: {
        current: latestCalories,
        target: 2000,
        progress: Math.min(latestCalories / 2000, 1),
        change: latestCalories - avgCalories
      },
      heartRate: {
        current: latestHeartRate,
        target: 80,
        progress: latestHeartRate > 0 ? Math.min(100 / latestHeartRate, 1) : 0,
        change: 0 // Heart rate change needs more complex calculation
      },
      sleep: {
        current: latestSleep,
        target: 8,
        progress: Math.min(latestSleep / 8, 1),
        change: 0 // Sleep change needs more complex calculation
      }
    };
  };

  const metrics = calculateMetrics();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Health Dashboard</h1>
                <p className="text-gray-600 mt-1">
                  {lastUpdate ? `Last updated: ${lastUpdate.toLocaleString()}` : 'Loading...'}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={handleRefresh} 
              disabled={refreshing}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className={cn('h-4 w-4', refreshing && 'animate-spin')} />
              Refresh
            </Button>
            
            {/* User Menu */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
              </div>
              <div className="flex items-center gap-2">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name || 'User'} 
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                )}
                {onSignOut && (
                  <>
                    {/* Desktop Logout Button */}
                    <Button
                      onClick={onSignOut}
                      variant="ghost"
                      size="sm"
                      className="hidden sm:flex text-gray-600 hover:text-red-600 hover:bg-red-50 p-2 gap-2 items-center"
                      title="Sign out"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="text-sm">Logout</span>
                    </Button>
                    
                    {/* Mobile Logout Button */}
                    <Button
                      onClick={onSignOut}
                      variant="ghost"
                      size="sm"
                      className="sm:hidden text-gray-600 hover:text-red-600 hover:bg-red-50 p-2"
                      title="Sign out"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Health Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <HealthMetricCard
            title="Steps"
            value={metrics?.steps.current || 0}
            unit="steps"
            target={metrics?.steps.target}
            progress={metrics?.steps.progress || 0}
            change={{
              value: Math.round(metrics?.steps.change || 0),
              period: 'vs avg',
              positive: (metrics?.steps.change || 0) > 0
            }}
            icon={<Activity className="h-4 w-4" />}
            loading={loading}
          />
          
          <HealthMetricCard
            title="Calories"
            value={metrics?.calories.current || 0}
            unit="kcal"
            target={metrics?.calories.target}
            progress={metrics?.calories.progress || 0}
            change={{
              value: Math.round(metrics?.calories.change || 0),
              period: 'vs avg',
              positive: (metrics?.calories.change || 0) > 0
            }}
            icon={<Flame className="h-4 w-4" />}
            loading={loading}
          />
          
          <HealthMetricCard
            title="Heart Rate"
            value={metrics?.heartRate.current || 0}
            unit="bpm"
            progress={metrics?.heartRate.progress || 0}
            icon={<Heart className="h-4 w-4" />}
            loading={loading}
          />
          
          <HealthMetricCard
            title="Sleep"
            value={Number((metrics?.sleep.current || 0).toFixed(1))}
            unit="hours"
            target={metrics?.sleep.target}
            progress={metrics?.sleep.progress || 0}
            icon={<Moon className="h-4 w-4" />}
            loading={loading}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Health Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Weekly Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ) : summary ? (
                  <p className="text-sm text-gray-600 leading-relaxed">{summary}</p>
                ) : (
                  <p className="text-sm text-gray-500">No summary available</p>
                )}
              </CardContent>
            </Card>

            {/* Quick Insights */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Quick Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))
                ) : (
                  <>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <p className="text-sm text-green-800">
                        Great job staying active this week!
                      </p>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <p className="text-sm text-blue-800">
                        Your sleep pattern is improving
                      </p>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <p className="text-sm text-orange-800">
                        Try to maintain consistent heart rate
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Health Chat */}
          <div className="lg:col-span-2">
            <HealthChat />
          </div>
        </div>

        {/* Footer */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="text-center text-sm text-gray-500">
              <p>
                Data synced with Google Health • Last sync: {lastUpdate?.toLocaleString() || 'Never'}
              </p>
              <p className="mt-2">
                This dashboard provides insights based on your health data and should not replace professional medical advice.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
