import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const MOVIES_DIR = 'D:\\movies';

export async function GET() {
    try {
        if (!fs.existsSync(MOVIES_DIR)) {
            return NextResponse.json({ error: `Directory not found: ${MOVIES_DIR}` }, { status: 404 });
        }

        const files = fs.readdirSync(MOVIES_DIR);
        
        const movies = files
            .filter(file => file.toLowerCase().endsWith('.mp4'))
            .map(file => {
                const stat = fs.statSync(path.join(MOVIES_DIR, file));
                return {
                    filename: file,
                    title: file.replace('.mp4', '').replace(/\./g, ' '),
                    sizeBytes: stat.size,
                    createdAt: stat.birthtime
                };
            });

        return NextResponse.json({ movies });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
