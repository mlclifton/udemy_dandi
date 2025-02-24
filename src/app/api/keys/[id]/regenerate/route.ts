import { NextResponse } from 'next/server';
import { getRepository } from '@/lib/database/repository-factory';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  
  try {
    const repository = getRepository();
    const newKey = await repository.regenerateApiKey(id);
    const updatedKey = await repository.getApiKeyById(id);
    return NextResponse.json(updatedKey);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to regenerate API key' }, { status: 500 });
  }
} 