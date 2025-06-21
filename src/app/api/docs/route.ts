import { NextResponse } from 'next/server';
import { swaggerSpec } from '@/lib/swagger';

export async function GET() {
    console.log("swagger specs", swaggerSpec);
  return NextResponse.json(swaggerSpec);
}