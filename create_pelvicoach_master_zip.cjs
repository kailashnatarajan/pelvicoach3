const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = __dirname;
const tempMaster = path.join(root, 'temp_master');
const targetDir = path.join(tempMaster, 'pelvicoach-master');

if (fs.existsSync(tempMaster)) {
  fs.rmSync(tempMaster, { recursive: true, force: true });
}
fs.mkdirSync(targetDir, { recursive: true });

const itemsToCopy = [
  '.env.example',
  '.github',
  '.gitignore',
  '.nojekyll',
  '.npmrc',
  'android',
  'app.json',
  'App.tsx',
  'assets',
  'babel.config.js',
  'eas.json',
  'github-pages-ready-to-paste.zip',
  'github_pages_deploy',
  'index.html',
  'MED-PS-013.pdf',
  'package-lock.json',
  'package.json',
  'README.md',
  'scripts',
  'single-file-github-pages.zip',
  'src',
  'standalone_for_github',
  'supabase',
  'tsconfig.json',
  'US10602979 patent 2.pdf',
  'US11172866 patent 3.pdf',
  'US11426115 patent 1.pdf',
  'US6264582 patent 4.pdf',
  'US6498953 patent 5.pdf',
  'web'
];

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src);
    for (const entry of entries) {
      if (entry === 'node_modules' || entry === '.expo' || entry === '.git') continue;
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log('Copying items to temp_master/pelvicoach-master...');
for (const item of itemsToCopy) {
  const srcPath = path.join(root, item);
  const destPath = path.join(targetDir, item);
  if (fs.existsSync(srcPath)) {
    copyRecursive(srcPath, destPath);
  }
}

console.log('Zipping pelvicoach-master.zip...');
const zipOutput = path.join(root, 'pelvicoach-master.zip');
if (fs.existsSync(zipOutput)) {
  fs.unlinkSync(zipOutput);
}

execSync(`tar -a -cf "${zipOutput}" -C "${tempMaster}" pelvicoach-master`);
console.log('Finished creating pelvicoach-master.zip!');
const size = fs.statSync(zipOutput).size;
console.log('Zip size:', (size / (1024 * 1024)).toFixed(2), 'MB');

// Clean up temp_master
fs.rmSync(tempMaster, { recursive: true, force: true });
console.log('Temp files cleaned up.');
