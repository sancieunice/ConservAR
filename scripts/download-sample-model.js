/**
 * Helper script to download a sample 3D model for testing AR functionality
 * Run with: node scripts/download-sample-model.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Sample model URL - Using a publicly available GLB model
// This is a simple cube model from Google's model-viewer examples
const MODEL_URL = 'https://modelviewer.dev/shared-assets/models/Astronaut.glb';
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'models');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'sample-astronaut.glb');

// Ensure models directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log('✓ Created models directory');
}

console.log('Downloading sample 3D model...');
console.log(`From: ${MODEL_URL}`);
console.log(`To: ${OUTPUT_FILE}`);

const file = fs.createWriteStream(OUTPUT_FILE);

https.get(MODEL_URL, (response) => {
  if (response.statusCode === 200) {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log('✓ Successfully downloaded sample model!');
      console.log('\nNext steps:');
      console.log('1. The model is saved as: public/models/sample-astronaut.glb');
      console.log('2. Update server/storage.ts to use this model for testing');
      console.log('3. Or download your own models and place them in public/models/');
    });
  } else if (response.statusCode === 301 || response.statusCode === 302) {
    // Handle redirects
    console.log('Following redirect...');
    https.get(response.headers.location, (redirectResponse) => {
      redirectResponse.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('✓ Successfully downloaded sample model!');
      });
    });
  } else {
    console.error(`✗ Failed to download: HTTP ${response.statusCode}`);
    fs.unlinkSync(OUTPUT_FILE);
    process.exit(1);
  }
}).on('error', (err) => {
  console.error(`✗ Error downloading model: ${err.message}`);
  fs.unlinkSync(OUTPUT_FILE);
  process.exit(1);
});

