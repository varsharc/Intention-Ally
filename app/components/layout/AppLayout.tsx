// app/components/layout/AppLayout.tsx
'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/app/providers/AuthProvider';
import { 
  LogOut, 
  Settings, 
  User, 
  Clock, 
  Star,
  Search,
  BarChart,
  PlusCircle
} from 'lucide-react';
import { useSearchConfigs } from '@/app/hooks/useSearchConfig';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, userSettings, loading: authLoading, logOut } = useAuth();
  const { configs, loading: configsLoading } = useSearchConfigs();
  const pathname = usePathname();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  const handleLogout = async () => {
    try {
      await logOut();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Show loading state while auth is being checked
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="w-8 h-8 border-2 border-gray-600 border-t-yellow-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // If no user after auth check, don't render layout (redirect will happen)
  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-200">
      <header className="bg-black p-4 border-b border-gray-800">
        <div className="flex items-center justify-between max-w-screen-xl mx-auto">
          <div className="flex items-center space-x-2">
            <Link href="/dashboard">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="font-bold text-black">A</span>
              </div>
            </Link>
            <h1 className="text-xl font-bold text-white">Intention-Ally</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/settings" className="p-2 text-gray-400 hover:text-white">
              <Settings size={20} />
            </Link>
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-white"
              aria-label="Log out"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
          <div className="p-4 flex-1 overflow-y-auto">
            <div className="space-y-1 mb-8">
              <Link href="/dashboard">
                <div className={`flex items-center space-x-2 p-2 ${pathname === '/dashboard' ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 text-gray-400 hover:text-white'} rounded`}>
                  <Clock size={18} />
                  <span>Today</span>
                </div>
              </Link>
              <Link href="/favorites">
                <div className={`flex items-center space-x-2 p-2 ${pathname === '/favorites' ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 text-gray-400 hover:text-white'} rounded`}>
                  <Star size={18} />
                  <span>Favorites</span>
                </div>
              </Link>
              <Link href="/history">
                <div className={`flex items-center space-x-2 p-2 ${pathname === '/history' ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 text-gray-400 hover:text-white'} rounded`}>
                  <Clock size={18} />
                  <span>History</span>
                </div>
              </Link>
              {userSettings?.isAdmin && (
                <Link href="/admin">
                  <div className={`flex items-center space-x-2 p-2 ${pathname === '/admin' ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 text-gray-400 hover:text-white'} rounded`}>
                    <BarChart size={18} />
                    <span>Admin</span>
                  </div>
                </Link>
              )}
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xs uppercase text-gray-500 font-semibold mb-2">My Search Topics</h2>
                <Link href="/search/new" className="text-xs text-yellow-500 hover:text-yellow-400">
                  <PlusCircle size={14} />
                </Link>
              </div>
              
              <div className="space-y-1">
                {configsLoading ? (
                  <div className="flex justify-center py-2">
                    <div className="w-4 h-4 border-2 border-gray-600 border-t-yellow-500 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <>
                    {configs.map(config => (
                      <Link key={config.id} href={`/search/${config.id}`}>
                        <div className={`flex items-center justify-between p-2 ${pathname === `/search/${config.id}` ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 text-gray-400 hover:text-white'} rounded`}>
                          <span>{config.name}</span>
                          {/* Badge for new results could be added here */}
                        </div>
                      </Link>
                    ))}
                    
                    {configs.length === 0 && (
                      <div className="text-sm text-gray-500 p-2">
                        No search topics yet
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-800">
            <Link href="/search/new">
              <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-4 py-2 rounded-md flex items-center justify-center">
                <Search size={16} className="mr-2" />
                New Search Topic
              </button>
            </Link>
          </div>
        </div>
        
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
}