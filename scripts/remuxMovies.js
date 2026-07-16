const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const ffmpeg = require('ffmpeg-static');

const MOVIES_DIR = 'D:\\movies';

async function remuxMovie(inputFile, outputFile) {
    return new Promise((resolve, reject) => {
        console.log(`\n🎬 Starting Remux: ${path.basename(inputFile)}`);
        
        // -map 0:v -map 0:a : Maps all video and all audio streams
        // -c copy : Copies the streams without re-encoding (instant)
        const args = [
            '-i', inputFile,
            '-map', '0:v?',
            '-map', '0:a?',
            '-map', '0:s?',
            '-c', 'copy',
            '-y', // Overwrite output files
            outputFile
        ];

        const process = spawn(ffmpeg, args);

        process.stderr.on('data', (data) => {
            // ffmpeg logs to stderr
            const output = data.toString();
            // Just show progress
            if (output.includes('time=')) {
                process.stdout.write(`\r🔄 Processing... ${output.match(/time=\S+/)[0]}`);
            }
        });

        process.on('close', (code) => {
            if (code === 0) {
                console.log(`\n✅ Successfully remuxed: ${path.basename(outputFile)}`);
                resolve();
            } else {
                console.error(`\n❌ Error remuxing ${path.basename(inputFile)}. Exit code: ${code}`);
                reject(new Error(`Exit code ${code}`));
            }
        });
    });
}

async function run() {
    console.log(`🔍 Scanning directory: ${MOVIES_DIR}`);
    
    if (!fs.existsSync(MOVIES_DIR)) {
        console.error(`❌ Directory not found: ${MOVIES_DIR}`);
        process.exit(1);
    }

    const files = fs.readdirSync(MOVIES_DIR);
    const mkvFiles = files.filter(f => f.toLowerCase().endsWith('.mkv'));

    if (mkvFiles.length === 0) {
        console.log('✅ No .mkv files found to remux.');
        return;
    }

    console.log(`Found ${mkvFiles.length} .mkv files to remux. Processing...\n`);

    for (const file of mkvFiles) {
        const inputFile = path.join(MOVIES_DIR, file);
        const outputFile = path.join(MOVIES_DIR, file.replace(/\.mkv$/i, '.mp4'));
        
        if (fs.existsSync(outputFile)) {
            console.log(`⏭️ Skipping ${file} - MP4 already exists.`);
            continue;
        }

        try {
            await remuxMovie(inputFile, outputFile);
        } catch (err) {
            console.error(`Failed to process ${file}:`, err);
        }
    }

    console.log('\n🎉 All remuxing tasks completed!');
}

run();
