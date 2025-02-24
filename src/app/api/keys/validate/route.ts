import { NextResponse } from 'next/server';
import { getRepository } from '@/lib/database/repository-factory';

export async function POST(request: Request) {
  try {
    const { key } = await request.json();
    const repository = getRepository();
    
    const apiKey = await repository.getApiKeyByKey(key);
    
    if (!apiKey) {
      return NextResponse.json({ valid: false }, { status: 404 });
    }

    return NextResponse.json({ valid: true }, { status: 200 });
  } catch (error) {
    console.error('API Key validation error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 