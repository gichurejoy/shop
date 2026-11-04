import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await props.params;
  const safeSegments = segments.map((s) => path.basename(s));
  const filePath = path.join(process.cwd(), 'public', 'uploads', ...safeSegments);

  try {
    const fileBuffer = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();

    const mimeTypes: Record<string, string> = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.webp': 'image/webp',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.avif': 'image/avif',
      '.bmp': 'image/bmp',
      '.ico': 'image/x-icon',
      '.txt': 'text/plain',
    };

    const contentType = mimeTypes[ext] || 'application/octet-stream';

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new NextResponse('File not found', { status: 404 });
  }
}
