const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const base = 'C:/Users/natar/.gemini/antigravity/brain/d0c9c3c6-f150-432f-8f87-6f7e10cff905';
const uploaded = path.join(base, '.user_uploaded');
const scratch = path.join(base, 'scratch');

const zip1 = path.join(uploaded, 'media_1793164174342_e16997e2.zip'); // files.zip
const zip2 = path.join(uploaded, 'media_1793164301883_49c9bec9.zip'); // pelvicoach-master.zip

const out1 = path.join(scratch, 'files_prev');
const out2 = path.join(scratch, 'pelvicoach_master_uploaded');

if (!fs.existsSync(out1)) fs.mkdirSync(out1, { recursive: true });
if (!fs.existsSync(out2)) fs.mkdirSync(out2, { recursive: true });

console.log('Unpacking zip1...');
execSync(`tar -xf "${zip1}" -C "${out1}"`);
console.log('out1 files:', fs.readdirSync(out1));

// if pelvicoach_project.zip is inside out1, unpack it too
if (fs.existsSync(path.join(out1, 'pelvicoach_project.zip'))) {
  const projDir = path.join(out1, 'project');
  if (!fs.existsSync(projDir)) fs.mkdirSync(projDir, { recursive: true });
  execSync(`tar -xf "${path.join(out1, 'pelvicoach_project.zip')}" -C "${projDir}"`);
  console.log('projDir files:', fs.readdirSync(projDir));
}

console.log('Unpacking zip2...');
execSync(`tar -xf "${zip2}" -C "${out2}"`);
console.log('out2 files:', fs.readdirSync(out2));
