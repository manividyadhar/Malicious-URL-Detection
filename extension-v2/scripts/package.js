const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const distDir = path.join(__dirname, '..', 'dist');
const zipPath = path.join(__dirname, '..', '..', 'client', 'public', 'malicious-url-detector-extension.zip');

// Ensure client/public exists
const publicDir = path.dirname(zipPath);
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

const output = fs.createWriteStream(zipPath);
const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
});

output.on('close', function () {
    console.log(archive.pointer() + ' total bytes');
    console.log('Extensions packaged successfully to ' + zipPath);
});

archive.on('warning', function (err) {
    if (err.code === 'ENOENT') {
        console.warn(err);
    } else {
        throw err;
    }
});

archive.on('error', function (err) {
    throw err;
});

archive.pipe(output);

// Append files from dist directory, putting them at the root of the zip
archive.directory(distDir, false);

archive.finalize();
