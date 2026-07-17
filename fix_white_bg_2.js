const fs = require('fs');
const path = require('path');

function processTsx(fp) {
  let content = fs.readFileSync(fp, 'utf8');
  let original = content;

  // Replace all variations of background: 'var(--color-white)' or '#ffffff' or 'white' or '#fff' with transparent or glassmorphism
  // But actually, we want glassmorphism for most things, but 'transparent' is safer if they are inside a section that already has glassmorphism.
  // Actually, wait, let's replace `background: 'var(--color-white)'` with `background: 'var(--glass-bg)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)'`
  
  // Regex to match background or backgroundColor in TSX inline styles
  content = content.replace(/(background|backgroundColor):\s*'var\(--color-white\)'/g, "background: 'var(--glass-bg)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)'");
  content = content.replace(/(background|backgroundColor):\s*'#ffffff'/g, "background: 'var(--glass-bg)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)'");
  content = content.replace(/(background|backgroundColor):\s*'#fff(?!b)'/g, "background: 'var(--glass-bg)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)'");
  content = content.replace(/(background|backgroundColor):\s*'white'/g, "background: 'var(--glass-bg)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)'");

  if (content !== original) {
    fs.writeFileSync(fp, content, 'utf8');
    console.log('Fixed TSX:', fp);
  }
}

function walkDir(dir, cb) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      walkDir(p, cb);
    } else if (p.endsWith('.tsx')) {
      cb(p);
    }
  });
}

walkDir(path.join(__dirname, 'src/app/(public)'), processTsx);
walkDir(path.join(__dirname, 'src/components/public'), processTsx);

console.log('Done public TSX fixing');
