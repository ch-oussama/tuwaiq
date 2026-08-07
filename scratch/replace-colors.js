const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p, callback);
    else callback(p);
  });
}

const NEW_HEX = '#a78b66';
const NEW_HOVER = '#8b7355';
const NEW_RGB = '167, 139, 102';

walk('src', (filepath) => {
  if (filepath.match(/\.(tsx|ts|css)$/)) {
    let content = fs.readFileSync(filepath, 'utf8');
    let original = content;
    
    // Hex code
    content = content.replace(/#D4AF37/gi, NEW_HEX);
    content = content.replace(/#E0B539/gi, NEW_HEX); // Any other yellow
    content = content.replace(/#c9a334/gi, NEW_HOVER);
    content = content.replace(/#cba028/gi, NEW_HOVER);
    
    // Globals.css specific overrides for dark mode gold
    content = content.replace(/#F0C040/gi, NEW_HEX);
    content = content.replace(/240,\s*192,\s*64/g, NEW_RGB);
    
    // rgb in design globe and others
    content = content.replace(/212,\s*175,\s*55/g, NEW_RGB);
    
    if (content !== original) {
      fs.writeFileSync(filepath, content);
      console.log('Updated', filepath);
    }
  }
});
