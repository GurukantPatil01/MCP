'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import { HealthDashboard } from '@/components/health/HealthDashboard';
import { AppHeader } from '@/components/AppHeader';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { isSignedIn, user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/');
    }
  }, [isLoaded, isSignedIn, router]);

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
    // Trigger refresh in the HealthDashboard component
    window.dispatchEvent(new CustomEvent('refreshHealthData'));
    setTimeout(() => setRefreshing(false), 2000);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      <AppHeader
        onSignOut={handleSignOut}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        lastUpdate={lastUpdate}
        user={{
          name: user?.fullName || user?.firstName || 'User',
          email: user?.primaryEmailAddress?.emailAddress || 'user@example.com',
          avatar: user?.imageUrl
        }}
      />
      <div className="pt-6">
        <HealthDashboard 
          onLastUpdateChange={setLastUpdate}
        />
      </div>
    </div>
  );
}
