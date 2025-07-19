import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET(req, { params }) {
  const { code } = params;
  const filePath = join(process.cwd(), 'data', 'courses.json');
  const data = JSON.parse(readFileSync(filePath, 'utf-8'));
  const course = data.find(c => c.code === code);
  if (!course) {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 });
  }
  return NextResponse.json(course);
}