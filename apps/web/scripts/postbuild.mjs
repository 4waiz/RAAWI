// GitHub Pages serves 404.html for unknown paths; copying index.html lets deep links like /pitch-demo work.
import { copyFileSync, writeFileSync } from 'node:fs';
copyFileSync('dist/index.html', 'dist/404.html');
writeFileSync('dist/.nojekyll', '');
console.log('postbuild: wrote 404.html and .nojekyll');
