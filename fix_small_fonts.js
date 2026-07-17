const fs = require('fs');
const path = require('path');

// Replace hardcoded small px font sizes with CSS variables or larger values
const replacements = [
  // 12px → var(--font-size-xs)
  { from: /fontSize:\s*'12px'/g, to: "fontSize: 'var(--font-size-xs)'" },
  // 13px → var(--font-size-sm)
  { from: /fontSize:\s*'13px'/g, to: "fontSize: 'var(--font-size-sm)'" },
  // 14px → var(--font-size-sm)
  { from: /fontSize:\s*'14px'/g, to: "fontSize: 'var(--font-size-sm)'" },
  // 15px → var(--font-size-base)
  { from: /fontSize:\s*'15px'/g, to: "fontSize: 'var(--font-size-base)'" },
  // Also fix inline style string versions (inside <style> tags)
  { from: /font-size:\s*12px;/g, to: 'font-size: var(--font-size-xs);' },
  { from: /font-size:\s*13px;/g, to: 'font-size: var(--font-size-sm);' },
  { from: /font-size:\s*14px;/g, to: 'font-size: var(--font-size-sm);' },
  { from: /font-size:\s*15px;/g, to: 'font-size: var(--font-size-base);' },
];

function processFile(fp) {
  let content = fs.readFileSync(fp, 'utf8');
  let original = content;
  for (const r of replacements) {
    content = content.replace(r.from, r.to);
  }
  if (content !== original) {
    fs.writeFileSync(fp, content, 'utf8');
    console.log('Fixed:', fp);
  }
}

function walkDir(dir, cb) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walkDir(p, cb);
    else if (p.endsWith('.tsx') || p.endsWith('.css')) cb(p);
  });
}

walkDir(path.join(__dirname, 'src/app/(public)'), processFile);
walkDir(path.join(__dirname, 'src/components/public'), processFile);
