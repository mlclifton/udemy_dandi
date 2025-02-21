'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string;
}

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [showNewKey, setShowNewKey] = useState<ApiKey | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) {
      alert('Please enter a key name');
      return;
    }

    const newKey = {
      id: Math.random().toString(36).substr(2, 9),
      name: newKeyName,
      key: `dk_${Math.random().toString(36).substr(2, 24)}`,
      createdAt: new Date().toISOString(),
      lastUsed: '-'
    };
    setApiKeys([...apiKeys, newKey]);
    setNewKeyName('');
    setIsCreating(false);
    setShowNewKey(newKey); // Show the full key after creation
  };

  const handleCopyKey = async (key: string) => {
    await navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDeleteKey = async (id: string) => {
    // TODO: Implement API key deletion
    setApiKeys(apiKeys.filter(key => key.id !== id));
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">API Keys</h1>
          <button
            onClick={() => setIsCreating(true)}
            className="rounded-full bg-foreground text-background px-4 py-2 hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors"
          >
            Create New API Key
          </button>
        </div>

        {showNewKey && (
          <div className="mb-8 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-green-700 dark:text-green-300">
                API Key Created Successfully
              </h2>
              <button
                onClick={() => setShowNewKey(null)}
                className="text-green-700 dark:text-green-300 hover:text-green-900"
              >
                ×
              </button>
            </div>
            <p className="text-sm text-green-600 dark:text-green-400 mb-2">
              Make sure to copy your API key now. You won't be able to see it again!
            </p>
            <div className="flex items-center gap-2 font-mono bg-white dark:bg-black/20 p-2 rounded">
              <code className="flex-1">{showNewKey.key}</code>
              <button
                onClick={() => handleCopyKey(showNewKey.key)}
                className="px-3 py-1 text-sm bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-800"
              >
                {copiedKey === showNewKey.key ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}

        {isCreating && (
          <div className="mb-8 p-4 border border-black/[.08] dark:border-white/[.145] rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Create New API Key</h2>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Key name"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="flex-1 px-3 py-2 border border-black/[.08] dark:border-white/[.145] rounded-md bg-transparent"
              />
              <button
                onClick={handleCreateKey}
                className="px-4 py-2 bg-foreground text-background rounded-md hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors"
              >
                Create
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 border border-black/[.08] dark:border-white/[.145] rounded-md hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {apiKeys.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-black/[.08] dark:border-white/[.145]">
                  <th className="text-left py-4 px-6">Name</th>
                  <th className="text-left py-4 px-6">API Key</th>
                  <th className="text-left py-4 px-6">Created</th>
                  <th className="text-left py-4 px-6">Last Used</th>
                  <th className="text-right py-4 px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map((key) => (
                  <tr
                    key={key.id}
                    className="border-b border-black/[.08] dark:border-white/[.145]"
                  >
                    <td className="py-4 px-6">{key.name}</td>
                    <td className="py-4 px-6 font-mono">
                      <div className="flex items-center gap-2">
                        <span>{key.key.slice(0, 8)}...{key.key.slice(-4)}</span>
                        <button
                          onClick={() => handleCopyKey(key.key)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          {copiedKey === key.key ? (
                            <span className="text-green-600">Copied!</span>
                          ) : (
                            <span>Copy</span>
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {new Date(key.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">{key.lastUsed}</td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDeleteKey(key.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No API keys found. Create one to get started.
          </div>
        )}
      </div>
    </div>
  );
}