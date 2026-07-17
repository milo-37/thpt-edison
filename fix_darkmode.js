const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function processFile(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace background: rgba(255,255,255, X) -> var(--glass-bg)
  content = content.replace(/background:\s*'(?:rgba\(255,\s*255,\s*255,\s*0\.[0-9]+\)|#ffffff)'/g, "background: 'var(--glass-bg)'");
  content = content.replace(/background:\s*(?:rgba\(255,\s*255,\s*255,\s*0\.[0-9]+\)|#ffffff)/g, "background: 'var(--glass-bg)'");
  
  // Also inline styles without quotes if they are in objects like background: rgba(255,255,255,0.8)
  content = content.replace(/background:\s*rgba\(255,\s*255,\s*255,\s*0\.[0-9]+\)/g, "background: 'var(--glass-bg)'");
  
  // Replace linear-gradients containing #ffffff
  content = content.replace(/background:\s*'linear-gradient\([^)]*#ffffff[^)]*\)'/g, "background: 'var(--color-gray-50)'");

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed', filePath);
  }
}

['src/app/(public)', 'src/components/public'].forEach(dir => {
  walkDir(path.join(__dirname, dir), processFile);
});

