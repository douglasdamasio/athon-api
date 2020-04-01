const mariadb = require('mysql');

module.exports = {

    init(req, res){
        res.send('ATHON_API!')
    },

    async executeQuery(req, res) {
        const connectionDb = mariadb.createConnection({
            host: process.env.MYSQL_HOST,
            port: process.env.MYSQL_PORT,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_ROOT_PASSWORD,
            database: process.env.MYSQL_DATABASE
        });

        connectionDb.query(req, function(error, results, fields){
            if (error) res.json(error);
            else res.json(results);
            connectionDb.end();
            console.log('Success');
        });
    },


}