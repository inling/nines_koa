const mysql = require('mysql');
const { MYSQL_CONFIG } = require('../config/mysql_config');

//创建连接池
const pool = mysql.createPool(MYSQL_CONFIG);

//sql查询
const query = (sql, val, callback) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            } else {
                connection.query(sql, val, (err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(callback(res));
                    }
                    connection.release();
                })
            }
        })
    })
}

module.exports = query;

/**v1.0.0 */
