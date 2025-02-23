import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await Promise.resolve(params);
  
  try {
    const { name, usage } = await request.json();
    const db = await getDb();
    
    await db.run(
      'UPDATE api_keys SET name = ?, usage = ? WHERE id = ?',
      [name, usage, id]
    );
    
    const updatedKey = await db.get('SELECT * FROM api_keys WHERE id = ?', id);
    return NextResponse.json(updatedKey);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update API key' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await Promise.resolve(params);
  
  try {
    const db = await getDb();
    await db.run('DELETE FROM api_keys WHERE id = ?', id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete API key' }, { status: 500 });
  }
} 