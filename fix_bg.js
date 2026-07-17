const fs = require('fs');
const path = require('path');

function walkDir(dir, cb) {
  fs.readdirSync(dir).forEach(f => {
    let p = path.join(dir, f);
    fs.statSync(p).isDirectory() ? walkDir(p, cb) : cb(p);
  });
}

let fixed = [];
function processFile(fp) {
  if (!fp.endsWith('.tsx') && !fp.endsWith('.ts')) return;
  let c = fs.readFileSync(fp, 'utf8');
  let o = c;

  // Replace linear-gradient(180deg, var(--color-white)...) -> transparent (inline style)
  c = c.replace(/background:\s*'linear-gradient\(180deg,\s*var\(--color-white\)\s*0%,\s*var\(--color-gray-50\)\s*100%\)'/g, "background: 'transparent'");

  // Replace linear-gradient(180deg, #ffffff...) variants -> transparent (inline style)
  c = c.replace(/background:\s*'linear-gradient\(180deg,\s*#ffffff\s*0%,\s*#f[0-9a-f]{4,5}\s*100%\)'/g, "background: 'transparent'");

  // Replace background: 'linear-gradient(135deg, #f0f4ff...)' -> transparent
  c = c.replace(/background:\s*'linear-gradient\(135deg,\s*#f0f4ff[^']*\)'/g, "background: 'transparent'");

  // In CSS blocks (inside <style> tags): 
  c = c.replace(/background:\s*linear-gradient\(180deg,\s*var\(--color-white\)\s*0%,\s*var\(--color-gray-50\)\s*100%\)\s*;/g, 'background: transparent;');
  c = c.replace(/background:\s*linear-gradient\(180deg,\s*#ffffff\s*0%,\s*#f[0-9a-f]{4,5}\s*100%\)\s*;/g, 'background: transparent;');

  if (c !== o) {
    fs.writeFileSync(fp, c, 'utf8');
    fixed.push(fp);
  }
}

['src/app/(public)', 'src/components/public'].forEach(d => {
  walkDir(path.join(__dirname, d), processFile);
});
console.log('Fixed:', fixed.length, 'files');
fixed.forEach(f => console.log(' -', f));
