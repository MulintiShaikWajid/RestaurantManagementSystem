var crypto = require('crypto');
var name = 'Democrat.squirrel';
var hash = crypto.createHash('sha256').update(name).digest('hex');
console.log(hash);