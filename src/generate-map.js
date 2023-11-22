const fs = require('fs');

const cardFiles = fs.readdirSync('./data-cards/').map(file => file.slice(0, -5).toLocaleLowerCase());
const cardGroupFiles = fs.readdirSync('./data-card-groups/').map(file => file.slice(0, -5).toLocaleLowerCase());
const cardMap = {files: cardFiles};
const cardGroupMap = {files: cardGroupFiles};

fs.writeFileSync('./card-map.json', JSON.stringify(cardMap));
fs.writeFileSync('./card-group-map.json', JSON.stringify(cardGroupMap));
