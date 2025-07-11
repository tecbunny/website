/**
 * Script to upload SVG files to Cloudinary
 * Run this once to migrate all local SVG files to Cloudinary
 */

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const SVG_FILES_TO_UPLOAD = [
  // Category icons
  { local: 'public/computer.svg', cloudinary: 'website/icons/computer', type: 'icon' },
  { local: 'public/network.svg', cloudinary: 'website/icons/network', type: 'icon' },
  { local: 'public/mobile.svg', cloudinary: 'website/icons/mobile', type: 'icon' },
  { local: 'public/personal.svg', cloudinary: 'website/icons/personal', type: 'icon' },
  
  // Product images
  { local: 'public/products/webcam.svg', cloudinary: 'website/products/webcam', type: 'product' },
  { local: 'public/products/speaker.svg', cloudinary: 'website/products/speaker', type: 'product' },
  { local: 'public/products/phone-case.svg', cloudinary: 'website/products/phone-case', type: 'product' },
  { local: 'public/products/keyboard.svg', cloudinary: 'website/products/keyboard', type: 'product' },
  { local: 'public/products/headphones.svg', cloudinary: 'website/products/headphones', type: 'product' },
  { local: 'public/products/gaming-mouse.svg', cloudinary: 'website/products/gaming-mouse', type: 'product' },
  { local: 'public/products/airpods.svg', cloudinary: 'website/products/airpods', type: 'product' },
  { local: 'public/products/router.svg', cloudinary: 'website/products/router', type: 'product' },
  
  // Brand logos
  { local: 'public/logo.svg', cloudinary: 'website/logos/logo', type: 'logo' },
];

async function uploadSVGToCloudinary(file: { local: string; cloudinary: string; type: string }) {
  try {
    const filePath = path.join(process.cwd(), file.local);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${file.local}`);
      return null;
    }

    const result = await cloudinary.uploader.upload(filePath, {
      public_id: file.cloudinary,
      resource_type: 'image',
      format: 'svg',
      tags: ['website', file.type],
      overwrite: true,
    });

    console.log(`✅ Uploaded: ${file.local} -> ${result.public_id}`);
    return result;
  } catch (error) {
    console.error(`❌ Error uploading ${file.local}:`, error);
    return null;
  }
}

async function uploadAllSVGs() {
  console.log('🚀 Starting SVG upload to Cloudinary...\n');
  
  const results = [];
  
  for (const file of SVG_FILES_TO_UPLOAD) {
    const result = await uploadSVGToCloudinary(file);
    if (result) {
      results.push({
        local: file.local,
        cloudinary: result.public_id,
        url: result.secure_url,
        type: file.type
      });
    }
  }
  
  console.log(`\n✅ Upload complete! ${results.length} files uploaded.`);
  console.log('\n📋 Summary:');
  results.forEach(result => {
    console.log(`  ${result.type}: ${result.local} -> ${result.url}`);
  });
  
  return results;
}

// Export for use in API routes
export { uploadAllSVGs };

// Run if called directly
if (require.main === module) {
  uploadAllSVGs().catch(console.error);
}
