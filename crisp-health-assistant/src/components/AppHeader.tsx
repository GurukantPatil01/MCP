'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { 
  Activity, 
  RefreshCw,
  LogOut,
  User,
  Utensils,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppHeaderProps {
  onSignOut?: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  lastUpdate?: Date | null;
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: BarChart3,
    description: 'Health metrics & insights'
  },
  {
    name: 'Diet Plan',
    href: '/diet',
    icon: Utensils,
    description: 'Meal plans & recipes'
  }
];

export function AppHeader({ 
  onSignOut, 
  onRefresh, 
  refreshing = false, 
  user, 
  lastUpdate 
}: AppHeaderProps) {
  const pathname = usePathname();

  return (
    <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Logo & Navigation */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">
                  Crisp Health
                </h1>
                {lastUpdate && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
                    Updated: {lastUpdate.toLocaleTimeString()}
                  </p>
                )}
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                    {item.name === 'Diet Plan' && (
                      <span className="ml-1 px-1.5 py-0.5 text-xs bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full">
                        New
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: Actions & User Menu */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Divider */}
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
            
            {/* Refresh Button */}
            {onRefresh && (
              <Button 
                onClick={onRefresh} 
                disabled={refreshing}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <RefreshCw className={cn('h-4 w-4', refreshing && 'animate-spin')} />
                <span className="hidden sm:inline">Sync</span>
              </Button>
            )}

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
              
              {/* Avatar */}
              <div className="flex items-center gap-2">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name || 'User'} 
                    className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                )}
                
                {/* Logout Button */}
                {onSignOut && (
                  <>
                    {/* Desktop */}
                    <Button
                      onClick={onSignOut}
                      variant="ghost"
                      size="sm"
                      className="hidden sm:flex text-gray-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </Button>
                    
                    {/* Mobile */}
                    <Button
                      onClick={onSignOut}
                      variant="ghost"
                      size="sm"
                      className="sm:hidden text-gray-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
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

        {/* Mobile Navigation */}
        <nav className="md:hidden mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                  {item.name === 'Diet Plan' && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full">
                      New
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
