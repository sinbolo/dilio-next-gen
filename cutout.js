const sharp = require('sharp');
const fs = require('fs');

async function removeBackground(inputPath, outputPath) {
    if (!fs.existsSync(inputPath)) {
        console.log(`File not found: ${inputPath}`);
        return;
    }
    console.log(`Processing ${inputPath}...`);
    const img = sharp(inputPath);
    const { data, info } = await img.raw().ensureAlpha().toBuffer({ resolveWithObject: true });
    
    const width = info.width;
    const height = info.height;
    const channels = info.channels;
    
    // Create a visited map for flood fill
    const visited = new Uint8Array(width * height);
    const stack = [];
    
    // Seed edges
    for (let x = 0; x < width; x++) {
        stack.push([x, 0]);
        stack.push([x, height - 1]);
    }
    for (let y = 0; y < height; y++) {
        stack.push([0, y]);
        stack.push([width - 1, y]);
    }
    
    const threshold = 15; // Tolerance for "black"
    
    const isDark = (x, y) => {
        if (x < 0 || x >= width || y < 0 || y >= height) return false;
        const idx = (y * width + x) * channels;
        return data[idx] <= threshold && data[idx+1] <= threshold && data[idx+2] <= threshold && data[idx+3] > 0;
    };
    
    let head = 0;
    while (head < stack.length) {
        const [x, y] = stack[head++];
        if (x < 0 || x >= width || y < 0 || y >= height) continue;
        
        const vIdx = y * width + x;
        if (visited[vIdx]) continue;
        
        if (isDark(x, y)) {
            visited[vIdx] = 1;
            const idx = vIdx * channels;
            data[idx+3] = 0; // transparent!
            
            stack.push([x+1, y]);
            stack.push([x-1, y]);
            stack.push([x, y+1]);
            stack.push([x, y-1]);
        } else {
             // Anti-aliasing / Fringing fix: if it's not dark enough to be pure background, 
             // but it's adjacent to background, it might be a halo. We could soften it.
             // For now, let's leave it intact.
        }
    }

    // Pass 2: Feathering the edges slightly to remove strict aliasing.
    // We will find pixels that are alpha > 0 but border alpha == 0
    const alphaMap = new Uint8Array(width * height);
    for (let i = 0; i < width * height; i++) {
         alphaMap[i] = data[i * channels + 3];
    }
    
    for (let y = 1; y < height - 1; y++) {
         for (let x = 1; x < width - 1; x++) {
              const idx = y * width + x;
              if (alphaMap[idx] > 0) {
                   // check neighbors
                   let bordersEmpty = 0;
                   if (alphaMap[idx - width] === 0) bordersEmpty++;
                   if (alphaMap[idx + width] === 0) bordersEmpty++;
                   if (alphaMap[idx - 1] === 0) bordersEmpty++;
                   if (alphaMap[idx + 1] === 0) bordersEmpty++;
                   
                   if (bordersEmpty > 0) {
                        data[idx * channels + 3] = 150; // semi-transparent edge
                   }
              }
         }
    }
    
    await sharp(data, {
        raw: {
            width: width,
            height: height,
            channels: channels
        }
    }).png().toFile(outputPath);
    console.log(`Saved transparent PNG: ${outputPath}`);
}

async function main() {
    const files = [
        "public/assets/Sabana_3_Unified.png",
        "public/assets/Sabana_2_Master_Infinity.png",
        "public/assets/Sabana_1_Unified_Final.png"
    ];
    for (const file of files) {
         await removeBackground(file, file.replace('.png', '_cutout.png'));
    }
}

main().catch(console.error);
