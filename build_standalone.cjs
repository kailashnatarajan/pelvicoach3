const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'web', 'dist');
const htmlPath = path.join(distDir, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Find JS and CSS files in dist/assets
const assetsDir = path.join(distDir, 'assets');
const files = fs.readdirSync(assetsDir);
const jsFile = files.find(f => f.endsWith('.js'));
const cssFile = files.find(f => f.endsWith('.css'));

console.log('Using JS bundle:', jsFile);
console.log('Using CSS bundle:', cssFile);

const jsContent = fs.readFileSync(path.join(assetsDir, jsFile), 'utf8');
const cssContent = cssFile ? fs.readFileSync(path.join(assetsDir, cssFile), 'utf8') : '';

// Replace CSS link with inline <style>
html = html.replace(/<link rel="stylesheet"[^>]*href="[^"]*"[^>]*>/i, `<style>\n${cssContent}\n</style>`);

// Remove external sample-session script tag so index.html stays ultra-light (< 600 KB) and well below GitHub's 1MB upload limit!
html = html.replace(/<script src="[^"]*sample-session\.js"><\/script>/i, '');

// Replace module script with inline module script
html = html.replace(/<script type="module"[^>]*src="[^"]*"[^>]*><\/script>/i, `<script type="module">\n${jsContent}\n</script>`);

// Write to root index.html and standalone_for_github/index.html
fs.writeFileSync(path.join(__dirname, 'index.html'), html, 'utf8');

const standaloneDir = path.join(__dirname, 'standalone_for_github');
if (!fs.existsSync(standaloneDir)) fs.mkdirSync(standaloneDir, { recursive: true });
fs.writeFileSync(path.join(standaloneDir, 'index.html'), html, 'utf8');
fs.writeFileSync(path.join(standaloneDir, '.nojekyll'), '', 'utf8');

// Copy icons and manifest to standalone_for_github
['manifest.json', 'icon-192.png', 'icon-512.png', 'sw.js'].forEach(f => {
  const src = path.join(__dirname, 'web', 'public', f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(standaloneDir, f));
    fs.copyFileSync(src, path.join(__dirname, f));
  }
});

// Update github_pages_deploy directory
const deployDir = path.join(__dirname, 'github_pages_deploy');
if (!fs.existsSync(deployDir)) fs.mkdirSync(deployDir, { recursive: true });

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}
copyRecursiveSync(distDir, deployDir);
fs.writeFileSync(path.join(deployDir, '.nojekyll'), '', 'utf8');
['manifest.json', 'icon-192.png', 'icon-512.png', 'sw.js'].forEach(f => {
  const src = path.join(__dirname, 'web', 'public', f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(deployDir, f));
  }
});

const finalSize = fs.statSync(path.join(__dirname, 'index.html')).size;
console.log('Optimized standalone index.html built! Size:', finalSize, 'bytes (~' + (finalSize/1024).toFixed(1) + ' KB)');
