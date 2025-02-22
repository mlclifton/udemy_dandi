import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = await getDb();
    const keys = await db.all('SELECT * FROM api_keys');
    return NextResponse.json(keys);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch API keys' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, usage } = await request.json();
    const db = await getDb();
    
    const id = Math.random().toString(36).substr(2, 9);
    const key = `dk_${Math.random().toString(36).substr(2, 24)}`;
    
    await db.run(
      'INSERT INTO api_keys (id, name, key, created_at, last_used, usage, usage_limit) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, name, key, new Date().toISOString(), '-', usage, 1000]
    );
    
    const newKey = await db.get('SELECT * FROM api_keys WHERE id = ?', id);
    return NextResponse.json(newKey);
  } catch (error) {
    console.error('Error creating API key:', error);
    return NextResponse.json({ error: 'Failed to create API key' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { name, usage } = await request.json();
    const db = await getDb();
    
    await db.run(
      'UPDATE api_keys SET name = ?, usage = ? WHERE id = ?',
      [name, usage, params.id]
    );
    
    const updatedKey = await db.get('SELECT * FROM api_keys WHERE id = ?', params.id);
    return NextResponse.json(updatedKey);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update API key' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDb();
    await db.run('DELETE FROM api_keys WHERE id = ?', params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete API key' }, { status: 500 });
  }
} 