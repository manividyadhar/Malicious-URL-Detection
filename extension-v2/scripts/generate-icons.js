const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '..', 'src', 'icons');

if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

// Minimal 1x1 Blue Pixel PNG
const pngBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/HwADBwIAMCb5mQAAAABJRU5ErkJggg==', 'base64');

const sizes = [16, 48, 128];

sizes.forEach(size => {
    const iconPath = path.join(iconsDir, `icon${size}.png`);
    if (!fs.existsSync(iconPath)) {
        fs.writeFileSync(iconPath, pngBuffer);
        console.log(`Created placeholder icon: ${iconPath}`);
    }
});
