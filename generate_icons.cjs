const fs = require('fs');
const zlib = require('zlib');

// Simple CRC32 implementation
function makeCrcTable() {
  let c;
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    crcTable[n] = c;
  }
  return crcTable;
}
const crcTable = makeCrcTable();

function crc32(buf) {
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ (-1)) >>> 0;
}

function writeChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(12 + len);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4);
  data.copy(buf, 8);
  const typeAndData = buf.subarray(4, 8 + len);
  buf.writeUInt32BE(crc32(typeAndData), 8 + len);
  return buf;
}

function createPng(size) {
  const width = size;
  const height = size;
  
  // Create scanlines: each row = 1 filter byte (0) + width * 4 RGBA
  const rawData = Buffer.alloc(height * (1 + width * 4));
  
  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.44; // rounded corner boundary
  
  for (let y = 0; y < height; y++) {
    const rowOffset = y * (1 + width * 4);
    rawData[rowOffset] = 0; // Filter: None
    
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      
      // Normalized coordinates -1 to 1
      const nx = (x - cx) / (width * 0.48);
      const ny = (y - cy) / (height * 0.48);
      const distFromCenter = Math.sqrt(nx * nx + ny * ny);
      
      // Teal gradient background (#0F766E to #0D9488)
      if (Math.abs(nx) < 0.95 && Math.abs(ny) < 0.95 && (Math.abs(nx) < 0.75 || Math.abs(ny) < 0.75 || Math.hypot(Math.abs(nx)-0.75, Math.abs(ny)-0.75) < 0.2)) {
        // Base Teal
        let r = 13 + Math.floor((ny + 1) * 6);
        let g = 148 + Math.floor((ny + 1) * 8);
        let b = 136 + Math.floor((ny + 1) * 6);
        let a = 255;
        
        // Draw Heart / Wave emblem in white/cyan
        // Heart formula: (x^2 + (y - sqrt(|x|))^2 - 1)
        const hx = (x - cx) / (width * 0.26);
        const hy = -((y - cy * 0.95) / (height * 0.26)); // invert y
        
        const heartDist = (hx * hx + Math.pow(hy - Math.sqrt(Math.abs(hx)), 2));
        if (heartDist < 0.88) {
          // White / cyan heart inside
          r = 255;
          g = 255;
          b = 255;
        } else if (heartDist < 1.05) {
          // Soft cyan edge
          r = 204;
          g = 251;
          b = 241;
        }
        
        rawData[pxOffset] = r;
        rawData[pxOffset + 1] = g;
        rawData[pxOffset + 2] = b;
        rawData[pxOffset + 3] = a;
      } else {
        // Transparent
        rawData[pxOffset] = 0;
        rawData[pxOffset + 1] = 0;
        rawData[pxOffset + 2] = 0;
        rawData[pxOffset + 3] = 0;
      }
    }
  }
  
  // PNG signature
  const sig = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace
  const ihdrChunk = writeChunk('IHDR', ihdr);
  
  // IDAT (compressed raw scanlines)
  const compressed = zlib.deflateSync(rawData, { level: 9 });
  const idatChunk = writeChunk('IDAT', compressed);
  
  // IEND
  const iendChunk = writeChunk('IEND', Buffer.alloc(0));
  
  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

const p192 = createPng(192);
const p512 = createPng(512);

// Save to web/public, assets/, and root
const targets = ['web/public', 'assets', 'github_pages_deploy/assets', 'standalone_for_github'];
targets.forEach(dir => {
  if (fs.existsSync(dir)) {
    fs.writeFileSync(`${dir}/icon-192.png`, p192);
    fs.writeFileSync(`${dir}/icon-512.png`, p512);
  }
});

// Also write to root assets
fs.writeFileSync('assets/icon.png', p512);
fs.writeFileSync('assets/adaptive-icon.png', p512);
fs.writeFileSync('assets/favicon.png', p192);

console.log('Successfully generated 192x192 and 512x512 PWA icons!');
