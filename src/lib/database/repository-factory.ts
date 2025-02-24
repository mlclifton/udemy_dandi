import { DatabaseRepository } from './types';
import { SQLiteRepository } from './sqlite-repository';
import { SupabaseRepository } from './supabase-repository';

export function getRepository(): DatabaseRepository {
  // You can switch this based on environment variables or other configuration
  const dbType = process.env.DATABASE_TYPE || 'sqlite';
  
  switch (dbType) {
    case 'sqlite':
      return new SQLiteRepository();
    case 'supabase':
      return new SupabaseRepository();
    default:
      return new SQLiteRepository();
  }
} 