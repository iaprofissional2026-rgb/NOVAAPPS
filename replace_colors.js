const fs = require('fs');
let content = fs.readFileSync('app/page.tsx', 'utf8');

// Replace backgrounds
content = content.replace(/bg-\[#0F0F0F\]/g, 'bg-background');
content = content.replace(/bg-\[#1A1A1A\]/g, 'bg-card');

// Replace borders
content = content.replace(/border-white\/10/g, 'border-border');
content = content.replace(/border-white\/5/g, 'border-border');
content = content.replace(/border-white\/20/g, 'border-border');
content = content.replace(/border-white\/30/g, 'border-border');

// Replace translucent backgrounds
content = content.replace(/bg-white\/5/g, 'bg-text/5');
content = content.replace(/bg-white\/10/g, 'bg-text/10');
content = content.replace(/bg-white\/20/g, 'bg-text/20');

// Replace text colors
content = content.replace(/text-white\/90/g, 'text-text/90');
content = content.replace(/text-white\/50/g, 'text-text/50');
content = content.replace(/text-white\/10/g, 'text-text/10');

// Replace text-white but keep it for primary/danger/secondary/black backgrounds
// We'll do this by first changing all text-white to text-text
content = content.replace(/text-white/g, 'text-text');

// Then revert text-text back to text-white for specific button classes
// This is a bit tricky with regex, let's just do some common combinations
content = content.replace(/bg-primary([^"']*)text-text/g, 'bg-primary$1text-white');
content = content.replace(/bg-danger([^"']*)text-text/g, 'bg-danger$1text-white');
content = content.replace(/bg-secondary([^"']*)text-text/g, 'bg-secondary$1text-white');
content = content.replace(/bg-black\/50([^"']*)text-text/g, 'bg-black/50$1text-white');
content = content.replace(/bg-primary\/90([^"']*)text-text/g, 'bg-primary/90$1text-white');

// Also check if text-text comes BEFORE bg-primary
content = content.replace(/text-text([^"']*)bg-primary/g, 'text-white$1bg-primary');
content = content.replace(/text-text([^"']*)bg-danger/g, 'text-white$1bg-danger');
content = content.replace(/text-text([^"']*)bg-secondary/g, 'text-white$1bg-secondary');

// Replace text-gray-400 with text-text/60 for better contrast adaptation
content = content.replace(/text-gray-400/g, 'text-text/60');
content = content.replace(/text-gray-500/g, 'text-text/50');
content = content.replace(/text-gray-600/g, 'text-text/40');

fs.writeFileSync('app/page.tsx', content);
console.log('Replacements done.');
