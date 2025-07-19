import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET(req, { params }) {
  const { id } = params;
  const filePath = join(process.cwd(), 'data', 'faculty.json');
  const data = JSON.parse(readFileSync(filePath, 'utf-8'));
  const faculty = data.find(f => String(f.id) === String(id));
  if (!faculty) {
    return NextResponse.json({ error: 'Faculty not found' }, { status: 404 });
  }
  return NextResponse.json(faculty);
}