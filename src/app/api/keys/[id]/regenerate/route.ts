import { NextResponse } from 'next/server';
import { getRepository } from '@/lib/database/repository-factory';
import type { NextRequest } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  
  try {
    const repository = getRepository();
    await repository.regenerateApiKey(id);
    const updatedKey = await repository.getApiKeyById(id);
    return NextResponse.json(updatedKey);
  } catch (error) {
    return NextResponse.json({ error: `Failed to regenerate API key: ${error}` }, { status: 500 });
  }
} 