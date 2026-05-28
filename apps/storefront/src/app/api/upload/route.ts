import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

async function ensureUploadDir() {
  try { await fs.access(UPLOAD_DIR); }
  catch { await fs.mkdir(UPLOAD_DIR, { recursive: true }); }
}

export async function POST(req: NextRequest) {
  try {
    await ensureUploadDir();
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const ext = path.extname(file.name) || '.bin';
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const filePath = path.join(UPLOAD_DIR, safeName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    const url = `/uploads/${safeName}`;
    return NextResponse.json({ url, name: file.name, size: file.size });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
