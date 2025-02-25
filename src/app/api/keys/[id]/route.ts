import { NextResponse } from 'next/server';
import { getRepository } from '@/lib/database/repository-factory';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const repository = getRepository();
    await repository.deleteApiKey(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: `Failed to delete API key: ${error}` }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, usage } = await request.json();

    if (!name || typeof usage !== 'number') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const repository = getRepository();
    await repository.updateApiKey(id, name, usage);
    const updatedKey = await repository.getApiKeyById(id);
    return NextResponse.json(updatedKey);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to update API key: ${error}` },
      { status: 500 }
    );
  }
} 