const fs = require('fs');  
const b64 = fs.readFileSync('content.b64', 'utf8').trim();  
const content = Buffer.from(b64, 'base64').toString('utf8');  
fs.writeFileSync('src/components/LessonPlanPage.tsx', content, 'utf8');  
console.log('Done: ' + content.split('\n').length + ' lines');  
