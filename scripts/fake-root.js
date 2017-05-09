const low = require('lowdb');
const fileAsync = require('lowdb/lib/storages/file-async');
const config = require('../config/environment');

const db = low(config.root + 'users.json', {
  storage: fileAsync
});

db.defaults({ users: [] }).write();

db.get('users').push({
    username: 'root',
    role: 'root',
    password: '123456',
    status: 'pass',
}).write();
