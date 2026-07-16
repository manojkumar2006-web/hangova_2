import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

const MOVIES_DIR = 'D:\\movies';

export async function GET(request: NextRequest) {
    const filename = request.nextUrl.searchParams.get('file');

    if (!filename) {
        return NextResponse.json({ error: 'No file specified' }, { status: 400 });
    }

    const filePath = path.join(MOVIES_DIR, filename);

    if (!fs.existsSync(filePath)) {
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = request.headers.get('range');

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = (end - start) + 1;
        
        const fileStream = fs.createReadStream(filePath, { start, end });
        
        // Convert Node stream to Web stream for Next.js Response
        const webStream = Readable.toWeb(fileStream);

        return new NextResponse(webStream as any, {
            status: 206,
            headers: {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize.toString(),
                'Content-Type': 'video/mp4',
            }
        });
    } else {
        const fileStream = fs.createReadStream(filePath);
        const webStream = Readable.toWeb(fileStream);
        
        return new NextResponse(webStream as any, {
            status: 200,
            headers: {
                'Content-Length': fileSize.toString(),
                'Content-Type': 'video/mp4',
            }
        });
    }
}
