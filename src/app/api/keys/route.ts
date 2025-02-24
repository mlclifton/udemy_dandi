import { NextResponse } from 'next/server';
import { getRepository } from '@/lib/database/repository-factory';

export async function GET() {
  try {
    const repository = getRepository();
    const keys = await repository.getAllApiKeys();
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

    const repository = getRepository();
    const newKey = await repository.createApiKey(name, usage);
    return NextResponse.json(newKey);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 