'use client';

import { useState } from 'react';
import type { ApiKey } from '@/types/api-keys';
import { KeyActions } from './key-actions';

interface KeyTableProps {
  keys: ApiKey[];
  onEdit: (key: ApiKey) => void;
  onDelete: (id: string) => void;
  onRegenerate: (id: string) => void;
}

export function KeyTable({ keys, onEdit, onDelete, onRegenerate }: KeyTableProps) {
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        {/* Table content */}
      </table>
    </div>
  );
} 