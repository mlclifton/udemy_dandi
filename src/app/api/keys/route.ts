import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ApiKey } from '@/types/api-keys';

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
    const body = await request.json();
    const { name, usage } = body;

    if (!name || typeof usage !== 'number') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const newKey = await createApiKey(name, usage);
    return NextResponse.json(newKey);
  } catch (error) {
    if (error instanceof DatabaseError) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 