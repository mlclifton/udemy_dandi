import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { ApiKey } from '@/types/api-keys';

let db: Database | null = null;

export async function getDb() {
  if (!db) {
    db = await open({
      filename: './database.sqlite',
      driver: sqlite3.Database
    });

    await db.exec(`
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
  return db;
}

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export async function createApiKey(name: string, usage: number): Promise<ApiKey> {
  try {
    const db = await getDb();
    const id = Math.random().toString(36).substr(2, 9);
    const key = `dk_${Math.random().toString(36).substr(2, 24)}`;
    const now = new Date().toISOString();
    
    await db.run(
      'INSERT INTO api_keys (id, name, key, created_at, last_used, usage, usage_limit) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, name, key, now, now, usage, 1000]
    );
    
    return { id, name, key, createdAt: now, lastUsed: now, usage, usage_limit: 1000 };
  } catch (error) {
    throw new DatabaseError(`Failed to create API key: ${error.message}`);
  }
}

export async function getAllApiKeys() {
  const db = await getDb();
  return db.all('SELECT * FROM api_keys');
}

export async function updateApiKey(id: string, name: string, usage: number) {
  const db = await getDb();
  await db.run(
    'UPDATE api_keys SET name = ?, usage = ? WHERE id = ?',
    [name, usage, id]
  );
}

export async function deleteApiKey(id: string) {
  const db = await getDb();
  await db.run('DELETE FROM api_keys WHERE id = ?', [id]);
}

export async function regenerateApiKey(id: string) {
  const db = await getDb();
  const newKey = `dk_${Math.random().toString(36).substr(2, 24)}`;
  await db.run(
    'UPDATE api_keys SET key = ? WHERE id = ?',
    [newKey, id]
  );
  return newKey;
}