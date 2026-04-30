import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const images = {
  bled: 'https://images.unsplash.com/photo-1558005664-3316d0c11e5b?w=1200&q=80',
  postojna: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&q=80',
  ljubljana: 'https://images.unsplash.com/photo-1562329395-7e03b4e08734?w=1200&q=80',
  triglav: 'https://images.unsplash.com/photo-1464822753764-0e7d4e4615c2?w=1200&q=80',
  soca: 'https://images.unsplash.com/photo-1548100780-9e8b8f9d7a3e?w=1200&q=80',
  piran: 'https://images.unsplash.com/photo-1559504156-8a9f0c0e2a3b?w=1200&q=80',
};

async function downloadImage(url, filename) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.pexels.com/',
        'Sec-Fetch-Dest': 'image',
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Site': 'cross-site',
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    if (buffer.length < 1000) {
      throw new Error(`File too small (${buffer.length} bytes)`);
    }
    
    fs.writeFileSync(filename, buffer);
    console.log(`Downloaded ${filename} (${buffer.length} bytes)`);
  } catch (err) {
    console.error(`Failed to download ${filename}:`, err.message);
  }
}

async function downloadAll() {
  const publicDir = path.join(__dirname, 'public');
  
  for (const [name, url] of Object.entries(images)) {
    await downloadImage(url, path.join(publicDir, `${name}.jpg`));
  }
}

downloadAll().then(() => console.log('All downloads completed'));
