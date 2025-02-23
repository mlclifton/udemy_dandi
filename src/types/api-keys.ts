export interface ApiKey {
  id: string;
  name: string;
  key: string;
  created_at: string;
  last_used: string;
  usage: number;
  usage_limit: number;
}

export interface KeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, usage: number) => void;
  initialName?: string;
  initialUsage?: number;
  mode: 'create' | 'edit';
} 