'use strict';

const mysql = require('mysql');

const con = mysql.createConnection({
    host: 'airline-database.chjyghsldlal.us-east-2.rds.amazonaws.com',
    user: 'admin',
    password: 'Hello123',
    database: 'sys',
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});
module.exports = con;