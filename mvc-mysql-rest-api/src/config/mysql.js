var mysql = require('mysql');
var configuration = {
    debug: true,
    port: 3306,
    mysql: {
        host: 'localhost',
        username: 'user',
        password: 'user_password',
        database: 'country_city',
    }
};

var connection = mysql.createConnection({
    host: configuration.mysql.host,
    port: configuration.port,
    user: configuration.mysql.username,
    password: configuration.mysql.password,
    database: configuration.mysql.database,
    insecureAuth: false,
});

module.exports = connection;