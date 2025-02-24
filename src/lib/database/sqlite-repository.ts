import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { DatabaseRepository, ApiKey } from './types';

export class SQLiteRepository implements DatabaseRepository {
  private db: Database | null = null;

  private async getDb() {
    if (!this.db) {
      this.db = await open({
        filename: './database.sqlite',
        driver: sqlite3.Database
      });

      await this.db.exec(`
        CREATE TABLE IF NOT EXISTS api_keys (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          key TEXT UNIQUE NOT NULL,
          created_at TEXT NOT NULL,
          last_used TEXT,
          usage INTEGER DEFAULT 0,
          usage_limit INTEGER DEFAULT 1000
        )
      `);
    }
    return this.db;
  }

  async createApiKey(name: string, usage: number): Promise<ApiKey> {
    const db = await this.getDb();
    const id = Math.random().toString(36).substr(2, 9);
    const key = `dk_${Math.random().toString(36).substr(2, 24)}`;
    const now = new Date().toISOString();
    
    await db.run(
      'INSERT INTO api_keys (id, name, key, created_at, last_used, usage, usage_limit) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, name, key, now, now, usage, 1000]
    );
    
    return { id, name, key, created_at: now, last_used: now, usage, usage_limit: 1000 };
  }

  async getAllApiKeys(): Promise<ApiKey[]> {
    const db = await this.getDb();
    return db.all('SELECT * FROM api_keys');
  }

  async updateApiKey(id: string, name: string, usage: number): Promise<void> {
    const db = await this.getDb();
    await db.run(
      'UPDATE api_keys SET name = ?, usage = ? WHERE id = ?',
      [name, usage, id]
    );
  }

  async deleteApiKey(id: string): Promise<void> {
    const db = await this.getDb();
    await db.run('DELETE FROM api_keys WHERE id = ?', [id]);
  }

  async regenerateApiKey(id: string): Promise<string> {
    const db = await this.getDb();
    const newKey = `dk_${Math.random().toString(36).substr(2, 24)}`;
    await db.run(
      'UPDATE api_keys SET key = ? WHERE id = ?',
      [newKey, id]
    );
    return newKey;
  }

  async getApiKeyById(id: string): Promise<ApiKey | null> {
    const db = await this.getDb();
    return db.get('SELECT * FROM api_keys WHERE id = ?', [id]);
  }

  async getApiKeyByKey(key: string): Promise<ApiKey | null> {
    const db = await this.getDb();
    return db.get('SELECT * FROM api_keys WHERE key = ?', [key]);
  }
} 