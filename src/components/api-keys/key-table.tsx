'use client';

import { useState } from 'react';
import type { ApiKey } from '@/types/api-keys';

interface KeyTableProps {
  keys: ApiKey[];
  onEdit: (key: ApiKey) => void;
  onDelete: (id: string) => void;
  onRegenerate: (id: string) => void;
}

export function KeyTable({ keys, onEdit, onDelete, onRegenerate }: KeyTableProps) {
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === '-') return '-';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-black/[.08] dark:border-white/[.145]">
            <th className="text-left py-4 px-6">NAME</th>
            <th className="text-left py-4 px-6">USAGE</th>
            <th className="text-left py-4 px-6">KEY</th>
            <th className="text-left py-4 px-6">CREATED ON</th>
            <th className="text-right py-4 px-6">OPTIONS</th>
          </tr>
        </thead>
        <tbody>
          {keys.map((key) => (
            <tr key={key.id} className="border-b border-black/[.08] dark:border-white/[.145]">
              <td className="py-4 px-6">{key.name}</td>
              <td className="py-4 px-6">{key.usage || 0}</td>
              <td className="py-4 px-6 font-mono">
                {visibleKeys.has(key.id) 
                  ? key.key
                  : `${key.key.slice(0, 4)}${'*'.repeat(key.key.length - 4)}`}
              </td>
              <td className="py-4 px-6">{formatDate(key.created_at)}</td>
              <td className="py-4 px-6 text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => toggleKeyVisibility(key.id)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                    title={visibleKeys.has(key.id) ? "Hide key" : "Show key"}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {visibleKeys.has(key.id) 
                        ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                        : <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>
                      }
                    </svg>
                  </button>
                  <button
                    onClick={() => onRegenerate(key.id)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                    title="Regenerate key"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 4v6h-6"/>
                      <path d="M1 20v-6h6"/>
                      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"/>
                      <path d="M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => onEdit(key)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                    title="Edit key"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(key.id)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                    title="Delete key"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 