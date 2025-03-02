'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created_at: string;
  last_used: string;
  usage: number;
  usage_limit: number;
}

interface ApiKeyResponse {
  error?: string;
}

interface KeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, usage: number) => void;
  initialName?: string;
  initialUsage?: number;
  mode: 'create' | 'edit';
}

function KeyModal({ isOpen, onClose, onSubmit, initialName = '', initialUsage = 1000, mode }: KeyModalProps) {
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

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingKeyId, setEditingKeyId] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadApiKeys = async () => {
      try {
        const response = await fetch('/api/keys');
        const keys = await response.json();
        setApiKeys(keys);
      } catch (error: unknown) {
        const err = error as Error;
        toast.error(`Failed to load API keys: ${err.message || 'Unknown error'}`);
      }
    };
    loadApiKeys();
  }, []);

  const handleCreateKey = async (name: string, usage: number) => {
    try {
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, usage }),
      });
      const newKey = await response.json() as ApiKeyResponse;
      if (!response.ok) throw new Error(newKey.error);
      
      setApiKeys([...apiKeys, newKey as unknown as ApiKey]);
      toast.success('API key created successfully');
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(`Failed to create API key: ${err.message || 'Unknown error'}`);
    }
  };

  const handleEditKey = async (id: string, name: string, usage: number) => {
    try {
      const response = await fetch(`/api/keys/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, usage }),
      });
      const updatedKey = await response.json() as ApiKeyResponse;
      if (!response.ok) throw new Error(updatedKey.error);

      setApiKeys(apiKeys.map(key => 
        key.id === id ? updatedKey as unknown as ApiKey : key
      ));
      toast.success('API key updated successfully');
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(`Failed to update API key: ${err.message || 'Unknown error'}`);
    }
  };

  const handleCopyKey = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      toast.success('API key copied to clipboard');
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(`Failed to copy API key: ${err.message || 'Unknown error'}`);
    }
  };

  const handleDeleteKey = async (id: string) => {
    try {
      const response = await fetch(`/api/keys/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete');

      setApiKeys(apiKeys.filter(key => key.id !== id));
      toast.success('API key deleted successfully');
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(`Failed to delete API key: ${err.message || 'Unknown error'}`);
    }
  };

  const handleRegenerateKey = async (keyId: string) => {
    try {
      const response = await fetch(`/api/keys/${keyId}/regenerate`, {
        method: 'POST',
      });
      const updatedKey = await response.json() as ApiKeyResponse;
      if (!response.ok) throw new Error(updatedKey.error);

      setApiKeys(apiKeys.map(key => 
        key.id === keyId ? updatedKey as unknown as ApiKey : key
      ));
      toast.success('API key regenerated successfully');
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(`Failed to regenerate API key: ${err.message || 'Unknown error'}`);
    }
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
    } catch {
      return 'Invalid Date';
    }
  };

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

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div><Toaster/></div>
        <h1 className="text-2xl font-bold mb-8">Overview</h1>
        
        <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-purple-500 to-orange-500 text-white">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm">CURRENT PLAN</span>
            <button className="bg-white/20 px-3 py-1 rounded-full text-sm hover:bg-white/30">
              Manage Plan
            </button>
          </div>
          <h2 className="text-2xl font-bold mb-4">Researcher</h2>
          <div>
            <div className="text-sm mb-2">API Limit</div>
            <div>24 / 1,000 Requests</div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">API Keys</h2>
          <button
            onClick={() => {
              setModalMode('create');
              setIsModalOpen(true);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <span>+</span> Create New Key
          </button>
        </div>

        <KeyModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingKeyId(null);
          }}
          onSubmit={(name, usage) => {
            if (modalMode === 'create') {
              handleCreateKey(name, usage);
            } else {
              handleEditKey(editingKeyId!, name, usage);
            }
          }}
          initialName={modalMode === 'edit' ? apiKeys.find(k => k.id === editingKeyId)?.name || '' : ''}
          initialUsage={modalMode === 'edit' ? apiKeys.find(k => k.id === editingKeyId)?.usage || 1000 : 1000}
          mode={modalMode}
        />

        {apiKeys.length > 0 ? (
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
                {apiKeys.map((key) => (
                  <tr
                    key={key.id}
                    className="border-b border-black/[.08] dark:border-white/[.145]"
                  >
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
                          onClick={() => handleRegenerateKey(key.id)}
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
                          onClick={() => handleCopyKey(key.key)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                          title="Copy key"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            setModalMode('edit');
                            setEditingKeyId(key.id);
                            setIsModalOpen(true);
                          }}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                          title="Edit key"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteKey(key.id)}
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
        ) : (
          <div className="text-center py-12 text-gray-500">
            No API keys found. Create one to get started.
          </div>
        )}
      </div>
    </div>
  );
}