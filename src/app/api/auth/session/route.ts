import { GET as AuthHandler } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    return await AuthHandler(request);
  } catch (error) {
    console.error('Session API error:', error);
    return NextResponse.json({ error: 'Failed to get session' }, { status: 500 });
  }
}
