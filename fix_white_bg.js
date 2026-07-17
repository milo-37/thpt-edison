const fs = require('fs');
const path = require('path');

// 1. Fix TSX inline backgrounds
function processTsx(fp) {
  let content = fs.readFileSync(fp, 'utf8');
  let original = content;

  content = content.replace(/background:\s*'var\(--color-white\)'/g, "background: 'transparent'");
  content = content.replace(/bg:\s*'var\(--color-white\)'/g, "bg: 'transparent'");
  content = content.replace(/background:\s*'white'/g, "background: 'transparent'");
  
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

// 2. Fix globals.css card backgrounds
const cssPath = path.join(__dirname, 'src/app/globals.css');
let css = fs.readFileSync(cssPath, 'utf8');
let originalCss = css;

// Replace `background: var(--color-white);` with glassmorphism in specific selectors
// We'll just replace it globally where it's used as a card background, but to be safe,
// let's do a targeted replace for typical card classes.
const cardClasses = [
  '.card', '.news-card', '.event-card', '.stat-card', '.team-card', 
  '.feature-card', '.info-box', '.premium-card', '.tab-button', '.content-card'
];

// Instead of parsing, we can just replace all `background: var(--color-white);` 
// with `background: var(--glass-bg); \n  backdrop-filter: blur(12px);` globally 
// for any rule that has it, because pretty much any white box on the page should be glassmorphic now!
css = css.replace(/background:\s*var\(--color-white\);/g, 'background: var(--glass-bg);\n  backdrop-filter: blur(16px);\n  -webkit-backdrop-filter: blur(16px);');
css = css.replace(/background-color:\s*var\(--color-white\);/g, 'background-color: var(--glass-bg);\n  backdrop-filter: blur(16px);\n  -webkit-backdrop-filter: blur(16px);');
css = css.replace(/background:\s*#fff;/g, 'background: var(--glass-bg);\n  backdrop-filter: blur(16px);\n  -webkit-backdrop-filter: blur(16px);');
css = css.replace(/background:\s*#ffffff;/g, 'background: var(--glass-bg);\n  backdrop-filter: blur(16px);\n  -webkit-backdrop-filter: blur(16px);');

// The body background also needs to be slightly transparent if we want the canvas to show through?
// Wait, the canvas is z-index: -1. So if the body has a solid background, the canvas is hidden!
// Wait! If canvas is z-index: -1, and body has background `#f0f4ff`, then canvas is on TOP of `html` but BEHIND `body`.
// Actually, `body` background is painted onto the canvas of the viewport. So canvas `z-index: -1` might be painted OVER the viewport background.
// But to be sure, let's make `body` background transparent in light mode too, and just use `--glass-bg` or let the canvas be the only background.
// Let's modify body background to be transparent.
css = css.replace(/background-color:\s*#f0f4ff;/g, 'background-color: transparent;');
css = css.replace(/background-color:\s*#020617;/g, 'background-color: transparent;');

if (css !== originalCss) {
  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('Fixed globals.css');
}

console.log('Done');
