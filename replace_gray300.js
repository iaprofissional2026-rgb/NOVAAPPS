const fs = require('fs');
let content = fs.readFileSync('app/page.tsx', 'utf8');

content = content.replace(/text-gray-300/g, 'text-text/80');
// Revert the one in bg-black/50
content = content.replace(/bg-black\/50([^"']*)text-text\/80/g, 'bg-black/50$1text-gray-300');

fs.writeFileSync('app/page.tsx', content);
console.log('Replacements done.');
