// setup-files.js - Run automatically before I/O benchmarks to create big files
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const file1Path = path.join(dir, 'bigfile.txt');
const file2Path = path.join(dir, 'bigfile2.txt');

function generateFileIfMissing(filePath, sizeInMB) {
  if (fs.existsSync(filePath)) {
    console.log(`File already exists: ${path.basename(filePath)} (${(fs.statSync(filePath).size / (1024 * 1024)).toFixed(2)} MB)`);
    return;
  }
  
  console.log(`Generating ${path.basename(filePath)} (${sizeInMB} MB)...`);
  const stream = fs.createWriteStream(filePath);
  const chunk = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(1000); // ~55KB chunk
  
  const chunksToWrite = Math.ceil((sizeInMB * 1024 * 1024) / Buffer.byteLength(chunk));
  
  for (let i = 0; i < chunksToWrite; i++) {
    stream.write(chunk);
  }
  stream.end();
  console.log(`✅ Generated ${path.basename(filePath)}`);
}

generateFileIfMissing(file1Path, 5);
generateFileIfMissing(file2Path, 5);
