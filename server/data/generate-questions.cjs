
const { questions } = require('../../client/src/data/questions.js');
const fs = require('fs');
fs.writeFileSync('./server/data/questions.json', JSON.stringify(questions, null, 2));
console.log('Generated questions.json with', questions.length, 'questions');
