'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MetricCardProps } from '@/types/health';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HealthMetricCardProps extends MetricCardProps {
  loading?: boolean;
  className?: string;
}

export function HealthMetricCard({
  title,
  value,
  unit,
  target,
  progress,
  change,
  icon,
  loading = false,
  className
}: HealthMetricCardProps) {
  if (loading) {
    return (
      <Card className={cn('w-full', className)}>
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-20" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-16 w-16 rounded-full mx-auto" />
          <Skeleton className="h-3 w-16 mx-auto" />
        </CardContent>
      </Card>
    );
  }

  const progressPercentage = Math.min(progress * 100, 100);
  const circumference = 2 * Math.PI * 30; // radius = 30
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <Card className={cn(
      'w-full hover:shadow-lg transition-all duration-300 border-l-4',
      progressPercentage >= 80 ? 'border-l-green-500' : 
      progressPercentage >= 50 ? 'border-l-yellow-500' : 'border-l-red-500',
      className
    )}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">
            {value.toLocaleString()}
          </span>
          <span className="text-sm text-muted-foreground">
            {unit}
          </span>
          {target && (
            <span className="text-xs text-muted-foreground">
              / {target.toLocaleString()}
            </span>
          )}
        </div>

        {/* Progress Ring */}
        <div className="flex justify-center">
          <div className="relative">
            <svg
              className="w-16 h-16 transform -rotate-90"
              viewBox="0 0 68 68"
            >
              {/* Background circle */}
              <circle
                cx="34"
                cy="34"
                r="30"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                className="text-gray-200"
              />
              {/* Progress circle */}
              <circle
                cx="34"
                cy="34"
                r="30"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className={cn(
                  'transition-all duration-700 ease-out',
                  progressPercentage >= 80 ? 'text-green-500' :
                  progressPercentage >= 50 ? 'text-yellow-500' : 'text-red-500'
                )}
                strokeLinecap="round"
              />
            </svg>
            {/* Percentage text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-semibold">
                {Math.round(progressPercentage)}%
              </span>
            </div>
          </div>
        </div>

        {/* Change indicator */}
        {change && (
          <div className="flex items-center justify-center gap-1 text-sm">
            {change.positive ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : change.value === 0 ? (
              <Minus className="h-4 w-4 text-gray-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
            <span className={cn(
              'font-medium',
              change.positive ? 'text-green-600' : 
              change.value === 0 ? 'text-gray-500' : 'text-red-600'
            )}>
              {change.value !== 0 && (change.positive ? '+' : '')}
              {change.value.toLocaleString()} {change.period}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
