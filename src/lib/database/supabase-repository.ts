import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { DatabaseRepository, ApiKey } from './types';
import { randomUUID } from 'crypto';

export class SupabaseRepository implements DatabaseRepository {
  private client: SupabaseClient;

  constructor() {
    this.client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  async createApiKey(name: string, usageLimit: number): Promise<ApiKey> {
    const newKey = {
      id: randomUUID(),
      name,
      key: randomUUID(),
      created_at: new Date().toISOString(),
      last_used: null,
      usage: 0,
      usage_limit: usageLimit
    };

    const { data, error } = await this.client
      .from('api_keys')
      .insert(newKey)
      .select()
      .single();

    if (error) {
      console.error('Error creating API key:', error);
      throw new Error('Failed to create API key');
    }

    return data;
  }

  async getAllApiKeys(): Promise<ApiKey[]> {
    const { data, error } = await this.client
      .from('api_keys')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching API keys:', error);
      throw new Error('Failed to fetch API keys');
    }

    return data || [];
  }

  async updateApiKey(id: string, name: string, usageLimit: number): Promise<void> {
    const { error } = await this.client
      .from('api_keys')
      .update({ name, usage_limit: usageLimit })
      .eq('id', id);

    if (error) {
      console.error('Error updating API key:', error);
      throw new Error('Failed to update API key');
    }
  }

  async deleteApiKey(id: string): Promise<void> {
    const { error } = await this.client
      .from('api_keys')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting API key:', error);
      throw new Error('Failed to delete API key');
    }
  }

  async regenerateApiKey(id: string): Promise<string> {
    const newKey = randomUUID();
    const { error } = await this.client
      .from('api_keys')
      .update({ key: newKey })
      .eq('id', id);

    if (error) {
      console.error('Error regenerating API key:', error);
      throw new Error('Failed to regenerate API key');
    }

    return newKey;
  }

  async getApiKeyById(id: string): Promise<ApiKey | null> {
    const { data, error } = await this.client
      .from('api_keys')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching API key:', error);
      throw new Error('Failed to fetch API key');
    }

    return data;
  }

  async getApiKeyByKey(key: string): Promise<ApiKey | null> {
    const { data, error } = await this.client
      .from('api_keys')
      .select('*')
      .eq('key', key)
      .single();

    if (error && error.code !== 'PGRST116') { // Ignore not found error
      console.error('Error fetching API key by key:', error);
      throw new Error('Failed to fetch API key');
    }

    return data;
  }
} 