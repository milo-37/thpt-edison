const fs = require('fs');
const path = require('path');

// 1. Update globals.css .section-alt
const cssPath = path.join(__dirname, 'src/app/globals.css');
let css = fs.readFileSync(cssPath, 'utf8');

// Replace .section-alt block
// It currently looks something like:
/*
.section-alt {
  background: rgba(248, 250, 252, 0.25);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  position: relative;
}
*/
const sectionAltRegex = /\.section-alt\s*\{[\s\S]*?position:\s*relative;\s*\}/;
const newSectionAlt = `.section-alt {
  position: relative;
  background: transparent;
  z-index: 1;
}

.section-alt::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(248, 250, 252, 0.25);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
  z-index: -1;
  pointer-events: none;
}`;

css = css.replace(sectionAltRegex, newSectionAlt);

// Also replace dark theme section alt
/*
[data-theme="dark"] .section-alt {
  background: rgba(15, 23, 42, 0.3);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}
*/
const darkSectionAltRegex = /\[data-theme="dark"\]\s*\.section-alt\s*\{[\s\S]*?\}/;
const newDarkSectionAlt = `[data-theme="dark"] .section-alt {
  background: transparent;
}

[data-theme="dark"] .section-alt::after {
  background: rgba(15, 23, 42, 0.3);
}`;

css = css.replace(darkSectionAltRegex, newDarkSectionAlt);

fs.writeFileSync(cssPath, css, 'utf8');
console.log('Fixed globals.css');

// 2. Remove hardcoded solid backgrounds from TSX files
function processTsx(fp) {
  let content = fs.readFileSync(fp, 'utf8');
  let original = content;

  // Remove `background: 'var(--color-gray-50)'` and similar solid backgrounds on sections
  content = content.replace(/style=\{\{\s*background:\s*'var\(--color-gray-50\)'\s*,?\s*/g, 'style={{ ');
  content = content.replace(/style=\{\{\s*background:\s*'var\(--color-gray-50\)'\s*\}\}/g, '');
  content = content.replace(/style=\{\{\s*position:\s*'relative',\s*overflow:\s*'hidden',\s*background:\s*'var\(--color-gray-50\)'\s*\}\}/g, "style={{ position: 'relative', overflow: 'hidden' }}");
  content = content.replace(/background:\s*'var\(--color-gray-50\)',?\s*/g, '');

  if (content !== original) {
    // Cleanup empty style={{ }}
    content = content.replace(/style=\{\{\s*\}\}/g, '');
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
