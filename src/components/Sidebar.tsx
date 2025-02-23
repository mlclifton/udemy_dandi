'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface SidebarItem {
  icon: JSX.Element;
  label: string;
  href: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sidebarItems: SidebarItem[] = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      ),
      label: 'Overview',
      href: '/dashboard'
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M3 12h6m6 0h6"/>
          <path d="M12 3v6m0 6v6"/>
        </svg>
      ),
      label: 'Research Assistant',
      href: '/dashboard/assistant'
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <path d="M14 2v6h6"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <line x1="10" y1="9" x2="8" y2="9"/>
        </svg>
      ),
      label: 'Research Reports',
      href: '/dashboard/reports'
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6"/>
          <polyline points="8 6 2 12 8 18"/>
        </svg>
      ),
      label: 'API Playground',
      href: '/dashboard/playground'
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
          <line x1="1" y1="10" x2="23" y2="10"/>
        </svg>
      ),
      label: 'Invoices',
      href: '/dashboard/invoices'
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
      ),
      label: 'Documentation',
      href: '/dashboard/docs'
    },
  ];

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} min-h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 relative`}>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transform transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      
      <div className="p-6">
        <h1 className={`text-2xl font-bold ${isCollapsed ? 'hidden' : ''}`}>API Key Manager</h1>
      </div>
      
      <nav className="mt-6">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                isActive ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' : ''
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <span className="w-6 h-6">{item.icon}</span>
              <span className={`${isCollapsed ? 'hidden' : ''}`}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
} 