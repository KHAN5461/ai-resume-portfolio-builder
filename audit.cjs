const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.tsx')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('src/dashboard');
let iconButtonsWithoutAria = [];

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, i) => {
        if ((line.includes('<Button') || line.includes('<button')) && !line.includes('aria-label')) {
            if (line.includes('size=\"icon\"') || line.includes("size='icon'") || line.match(/className=\"[^\"]*rounded-full[^\"]*\"/)) {
                 iconButtonsWithoutAria.push(file + ':' + (i+1) + ' ' + line.trim());
            }
        }
    });
});

console.log(iconButtonsWithoutAria.join('\n'));
