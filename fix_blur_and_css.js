const fs = require('fs');
const path = require('path');

function processTsx(fp) {
  let content = fs.readFileSync(fp, 'utf8');
  let original = content;

  // Fix the broken CSS inside <style> tags.
  // The broken CSS looks like this:
  // background: 'var(--glass-bg)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)';
  // OR
  // background: 'var(--glass-bg)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' !important;
  
  // Regex to match the exact broken string we introduced, when it is inside a CSS block (ends with ; or !important;)
  // We'll just replace the exact broken string globally in the file if it's followed by ; or \n or !important
  const brokenStr = "background: 'var(--glass-bg)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)'";
  const fixedStr = "background: var(--glass-bg);\n          backdrop-filter: blur(4px);\n          -webkit-backdrop-filter: blur(4px)";
  
  // If it's used inside style={{...}} (React inline style), it shouldn't have a semicolon at the end, but wait!
  // My previous script blindly replaced:
  // content.replace(/(background|backgroundColor):\s*'var\(--color-white\)'/g, "background: 'var(--glass-bg)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)'");
  // So inside React inline style it looks like: style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }} (this is VALID React)
  // Inside <style> it looks like: background: 'var(--glass-bg)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)'; (this is INVALID CSS)
  
  // Let's find occurrences of `brokenStr` followed by `;` or `!important` and replace with valid CSS.
  // Also we need to fix the `background: 'var(--glass-bg)';` which was in gioi-thieu/page.tsx
  content = content.replace(/background:\s*'var\(--glass-bg\)',\s*backdropFilter:\s*'blur\(16px\)',\s*WebkitBackdropFilter:\s*'blur\(16px\)'\s*(!important)?\s*;/g, 
    "background: var(--glass-bg);\n  backdrop-filter: blur(4px);\n  -webkit-backdrop-filter: blur(4px);$1");
    
  content = content.replace(/background:\s*'var\(--glass-bg\)'\s*(!important)?\s*;/g, 
    "background: var(--glass-bg)$1;");

  // Also reduce blur in valid React inline styles to make the background more visible
  content = content.replace(/blur\(16px\)/g, "blur(4px)");

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

// Let's also fix globals.css to reduce blur so the background shines through
const cssPath = path.join(__dirname, 'src/app/globals.css');
if (fs.existsSync(cssPath)) {
  let css = fs.readFileSync(cssPath, 'utf8');
  let originalCss = css;
  
  css = css.replace(/backdrop-filter:\s*blur\(12px\)/g, "backdrop-filter: blur(4px)");
  css = css.replace(/-webkit-backdrop-filter:\s*blur\(12px\)/g, "-webkit-backdrop-filter: blur(4px)");
  
  css = css.replace(/backdrop-filter:\s*blur\(16px\)/g, "backdrop-filter: blur(4px)");
  css = css.replace(/-webkit-backdrop-filter:\s*blur\(16px\)/g, "-webkit-backdrop-filter: blur(4px)");
  
  // Change transparent body back to #f4f7fe to give a nice base color for the particles
  // Wait, if body is #f4f7fe, we want the particles to be visible. Yes.
  css = css.replace(/body\s*{[^}]*background-color:\s*transparent;/, (match) => {
    return match.replace('background-color: transparent;', 'background-color: #f4f7fe;');
  });

  if (css !== originalCss) {
    fs.writeFileSync(cssPath, css, 'utf8');
    console.log('Fixed globals.css');
  }
}
