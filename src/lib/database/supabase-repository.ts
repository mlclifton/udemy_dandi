import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { DatabaseRepository, ApiKey } from './types';

export class SupabaseRepository implements DatabaseRepository {
  private client: SupabaseClient;

  constructor() {
    this.client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  async createApiKey(name: string, usage: number): Promise<ApiKey> {
    const id = Math.random().toString(36).substr(2, 9);
    const key = `dk_${Math.random().toString(36).substr(2, 24)}`;
    const now = new Date().toISOString();
    
    const { data, error } = await this.client
      .from('api_keys')
      .insert({
        id,
        name,
        key,
        created_at: now,
        last_used: now,
        usage,
        usage_limit: 1000
      })
      .select()
      .single();

    if (error) throw error;
    return data as ApiKey;
  }

  async getAllApiKeys(): Promise<ApiKey[]> {
    const { data, error } = await this.client
      .from('api_keys')
      .select('*');

    if (error) throw error;
    return data as ApiKey[];
  }

  async updateApiKey(id: string, name: string, usage: number): Promise<void> {
    const { error } = await this.client
      .from('api_keys')
      .update({ name, usage })
      .eq('id', id);

    if (error) throw error;
  }

  async deleteApiKey(id: string): Promise<void> {
    const { error } = await this.client
      .from('api_keys')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async regenerateApiKey(id: string): Promise<string> {
    const newKey = `dk_${Math.random().toString(36).substr(2, 24)}`;
    
    const { error } = await this.client
      .from('api_keys')
      .update({ key: newKey })
      .eq('id', id);

    if (error) throw error;
    return newKey;
  }

  async getApiKeyById(id: string): Promise<ApiKey | null> {
    const { data, error } = await this.client
      .from('api_keys')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as ApiKey;
  }
} 