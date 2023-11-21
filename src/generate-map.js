const fs = require('fs');

const files = fs.readdirSync('./data-cards/').map(file => file.slice(0, -5).toLocaleLowerCase());
const map = {
    files: files
};

fs.writeFileSync('./card-map.json', JSON.stringify(map));
