/**
 * Build Script
 * 
 * Copies non-TypeScript files to dist folder
 */

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');
const distDir = path.join(__dirname, '..', 'dist');

// Create dist directory if it doesn't exist
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Copy manifest.json
fs.copyFileSync(
    path.join(srcDir, 'manifest.json'),
    path.join(distDir, 'manifest.json')
);

// Copy popup.html
fs.copyFileSync(
    path.join(srcDir, 'popup.html'),
    path.join(distDir, 'popup.html')
);

// Create icons directory
const iconsDir = path.join(distDir, 'icons');
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

// Copy icons if they exist
const iconSizes = [16, 48, 128];
iconSizes.forEach(size => {
    const iconPath = path.join(srcDir, 'icons', `icon${size}.png`);
    if (fs.existsSync(iconPath)) {
        fs.copyFileSync(iconPath, path.join(iconsDir, `icon${size}.png`));
    }
});

console.log('✅ Build complete! Extension files copied to dist/');
