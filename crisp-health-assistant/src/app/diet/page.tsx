'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import { redirect, useRouter } from 'next/navigation';
import { DietPlan } from '@/components/DietPlan';
import { AppHeader } from '@/components/AppHeader';
import { useState } from 'react';

export default function DietPlanPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    redirect('/sign-in');
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // Trigger refresh functionality for diet plan
    window.dispatchEvent(new CustomEvent('refreshDietPlan'));
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      <AppHeader
        onSignOut={handleSignOut}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        user={{
          name: user?.fullName || user?.firstName || 'User',
          email: user?.primaryEmailAddress?.emailAddress || 'user@example.com',
          avatar: user?.imageUrl
        }}
      />
      <div className="pt-6">
        <DietPlan />
      </div>
    </div>
  );
}
