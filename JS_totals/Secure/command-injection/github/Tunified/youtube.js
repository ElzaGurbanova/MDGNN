import axios from 'axios';
import dotenv from 'dotenv';
import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';

dotenv.config();

const execFileAsync = promisify(execFile);

function normalizePart(s) {
  return String(s ?? '').trim();
}

async function getYouTubeMusicDetails(artist, track) {
  const searchString = [normalizePart(artist), normalizePart(track)]
    .filter(Boolean)
    .join(' ');

  try {
    // Resolve the script path within the current project
    const scriptPath = path.resolve(process.cwd(), 'src/ytmusic', 'api.py');

    // Use execFile to avoid a shell; pass arguments as an array
    const { stdout } = await execFileAsync('python3', [scriptPath, searchString], {
      shell: false,
      maxBuffer: 1024 * 1024, // prevent very large outputs from throwing
    });

    const data = JSON.parse(stdout);

    if (data.error) {
      throw new Error(data.error);
    }

    if (!data.results || data.results.length === 0) {
      console.log('No results found for:', searchString);
      return null;
    }

    const firstResult = data.results[0];

    if (firstResult.thumbnails && firstResult.thumbnails.length > 0) {
      const modifiedThumbnailUrl = firstResult.thumbnails[0].url.replace(/w60-h60/, 'w1080-h1080');
      return {
        id: firstResult.videoId,
        albumCover: modifiedThumbnailUrl,
      };
    } else {
      return {
        id: firstResult.videoId,
        albumCover: null,
      };
    }
  } catch (error) {
    console.error('YouTube Music API error:', error);
    return null;
  }
}

export { getYouTubeMusicDetails };

