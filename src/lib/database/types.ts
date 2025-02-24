export interface ApiKey {
  id: string;
  name: string;
  key: string;
  created_at: string;
  last_used: string;
  usage: number;
  usage_limit: number;
}

export interface DatabaseRepository {
  createApiKey(name: string, usage: number): Promise<ApiKey>;
  getAllApiKeys(): Promise<ApiKey[]>;
  updateApiKey(id: string, name: string, usage: number): Promise<void>;
  deleteApiKey(id: string): Promise<void>;
  regenerateApiKey(id: string): Promise<string>;
  getApiKeyById(id: string): Promise<ApiKey | null>;
  getApiKeyByKey(key: string): Promise<ApiKey | null>;
} 