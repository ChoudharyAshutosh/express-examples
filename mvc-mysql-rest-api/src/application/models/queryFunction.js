var conn = require('../../config/mysql');

// Allows us to run cutom MySQL query

module.exports.customQuery = (query, callback)=>{
    conn.query(query,(err, rows)=>{
        // here we return the results of the query
        callback(err, rows);
    });
};
