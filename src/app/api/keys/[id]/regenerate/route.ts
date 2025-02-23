import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await Promise.resolve(params);
  
  try {
    const db = await getDb();
    const newKey = `dk_${Math.random().toString(36).substr(2, 24)}`;
    
    await db.run(
      'UPDATE api_keys SET key = ? WHERE id = ?',
      [newKey, id]
    );
    
    const updatedKey = await db.get('SELECT * FROM api_keys WHERE id = ?', id);
    return NextResponse.json(updatedKey);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to regenerate API key' }, { status: 500 });
  }
} 