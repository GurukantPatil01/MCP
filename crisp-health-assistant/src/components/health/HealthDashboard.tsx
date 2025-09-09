'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { HealthMetricCard } from './HealthMetricCard';
import { HealthChat } from './HealthChat';
import { HealthData } from '@/types/health';
import { 
  Activity, 
  Flame, 
  Heart, 
  Moon, 
  TrendingUp,
  Lightbulb
} from 'lucide-react';

interface HealthDashboardProps {
  onLastUpdateChange?: (date: Date | null) => void;
}

export function HealthDashboard({ onLastUpdateChange }: HealthDashboardProps) {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<string>('');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchHealthData = async () => {
    try {
      const response = await fetch('/api/health/data?type=all&days=7');
      const data = await response.json();

      if (response.ok && data.data) {
        setHealthData(data.data);
        const updateTime = new Date(data.timestamp);
        setLastUpdate(updateTime);
        onLastUpdateChange?.(updateTime);
      } else {
        console.error('Failed to fetch health data:', data.error);
      }
    } catch (error) {
      console.error('Error fetching health data:', error);
    } finally {
      setLoading(false);
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

  const fetchHealthDataCallback = React.useCallback(fetchHealthData, [onLastUpdateChange]);
  const fetchHealthSummaryCallback = React.useCallback(fetchHealthSummary, []);

  useEffect(() => {
    fetchHealthDataCallback();
    fetchHealthSummaryCallback();
    
    // Listen for refresh events from header
    const handleRefresh = () => {
      fetchHealthDataCallback();
      fetchHealthSummaryCallback();
    };
    
    window.addEventListener('refreshHealthData', handleRefresh);
    return () => window.removeEventListener('refreshHealthData', handleRefresh);
  }, [fetchHealthDataCallback, fetchHealthSummaryCallback]);


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
    <div className="p-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6">

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
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{summary}</p>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No summary available</p>
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
                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <p className="text-sm text-green-800 dark:text-green-300">
                        Great job staying active this week!
                      </p>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <p className="text-sm text-blue-800 dark:text-blue-300">
                        Your sleep pattern is improving
                      </p>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <p className="text-sm text-orange-800 dark:text-orange-300">
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
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
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
