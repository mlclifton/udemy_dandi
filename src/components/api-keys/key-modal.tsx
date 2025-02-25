'use client';

import { useState, useEffect } from 'react';
import type { KeyModalProps } from '@/types/api-keys';

export function KeyModal({ isOpen, onClose, onSubmit, initialName = '', initialUsage = 1000, mode }: KeyModalProps) {
  const [name, setName] = useState(initialName);
  const [usage, setUsage] = useState(initialUsage);

  useEffect(() => {
    setName(initialName);
    setUsage(initialUsage);
  }, [initialName, initialUsage]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {mode === 'create' ? 'Create a new API key' : 'Edit API key'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Enter a name and usage for the {mode === 'create' ? 'new' : ''} API key.
        </p>
        
        <div className="mb-4">
          <label className="block mb-2">
            Key Name — A unique name to identify this key
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent"
            placeholder="Key Name"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">
            Usage*
          </label>
          <input
            type="number"
            value={usage}
            onChange={(e) => setUsage(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent"
          />
          <p className="text-sm text-gray-500 mt-2">
            * If the combined usage of all your keys exceeds your plan&apos;s limit, all requests will be rejected.
          </p>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSubmit(name, usage);
              setName('');
              setUsage(1000);
              onClose();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {mode === 'create' ? 'Create' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
} 