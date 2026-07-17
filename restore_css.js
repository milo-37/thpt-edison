const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src/app/globals.css');
let content = fs.readFileSync(cssPath, 'utf8');

// Since the `replace_file_content` tool messed up, let's look for the exact string it left behind.
// The file currently has:
// *, *::before, *::after {
//   box-sizing: border-box;
//   margin: 0;
//   font-weight: 800;
// }
// 
// a {
//   color: inherit;

// Wait, the diff said it replaced lines 148 to 182 with just `font-weight: 800;`.
// Let's re-insert `html`, `body`, `[data-theme="dark"] body` and `h1, h2, h3, h4, h5, h6` in between `*::after` and `a`.

const correctBlock = `*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  line-height: 1.6;
  color: var(--color-gray-800);
  background-color: #f4f7fe;
  background-image: 
    radial-gradient(ellipse at 10% 15%, rgba(10, 75, 175, 0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 85% 20%, rgba(255, 107, 0, 0.04) 0%, transparent 45%),
    radial-gradient(ellipse at 50% 60%, rgba(99, 102, 241, 0.03) 0%, transparent 55%),
    radial-gradient(ellipse at 20% 80%, rgba(6, 182, 212, 0.025) 0%, transparent 40%),
    radial-gradient(ellipse at 75% 75%, rgba(168, 85, 247, 0.02) 0%, transparent 45%);
  background-attachment: fixed;
  overflow-x: hidden;
  transition: background-color var(--transition-base), color var(--transition-fast);
  letter-spacing: -0.015em;
  position: relative;
}

[data-theme="dark"] body {
  background-color: #020617;
  background-image: 
    radial-gradient(ellipse at 10% 15%, rgba(10, 75, 175, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 85% 20%, rgba(255, 107, 0, 0.08) 0%, transparent 45%),
    radial-gradient(ellipse at 50% 60%, rgba(99, 102, 241, 0.06) 0%, transparent 55%),
    radial-gradient(ellipse at 20% 80%, rgba(6, 182, 212, 0.05) 0%, transparent 40%),
    radial-gradient(ellipse at 75% 75%, rgba(168, 85, 247, 0.04) 0%, transparent 45%);
  background-attachment: fixed;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-title);
  letter-spacing: -0.03em;
  font-weight: 800;
}`;

// We will find `*, *::before, *::after {` and the next `}` and `font-weight: 800; }`
// Actually, let's just do a RegExp replace from `\*, \*::before, \*::after {` to `font-weight: 800;\s*}`

content = content.replace(/\*, \*::before, \*::after {[\s\S]*?font-weight: 800;\s*}/, correctBlock);

fs.writeFileSync(cssPath, content, 'utf8');
console.log('Restored globals.css');
