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
      {/* Modal content */}
    </div>
  );
} 