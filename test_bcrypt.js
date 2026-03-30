const bcrypt = require('bcryptjs');
bcrypt.hash('test', 10).then(h => console.log('HASH:', h)).catch(e => console.error('ERROR:', e));
