const fs = require('fs');
const path = require('path');

const globalsPath = path.join(__dirname, '../app/globals.css');
let css = fs.readFileSync(globalsPath, 'utf8');

// Replace primary hue 260 -> 245 (Blue)
css = css.replace(/260\)/g, '245)');
css = css.replace(/260 \//g, '245 /');

// Replace neutral hue 270 -> 255 (Blueish neutral)
css = css.replace(/270\)/g, '255)');
css = css.replace(/270 \//g, '255 /');

fs.writeFileSync(globalsPath, css, 'utf8');
console.log('Successfully updated globals.css theme to blue tone.');
