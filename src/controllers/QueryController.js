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

    showCrimes(req, res){
        let filter = '';
        if (req.params.id) filter = ' where cri.id_crime=' + parseInt(req.params.id);
        this.executeQuery(
            `select cri.id_crime as 'ID CRIME', 
            vic.tx_name as 'VITIMAS', 
            wpn.tx_model as 'ARMAS', 
            crm.tx_name as 'CRIMINOSOS', 
            cri.tx_country as 'PAÍS',
            cri.dt_crime as 'DATA'
            from crime cri
            inner join victim_crime vcc 	on cri.id_crime = vcc.id_crime
            inner join victim vic 			on vcc.id_victim = vic.id_victim
            inner join weapon_crime wcc 	on cri.id_crime = wcc.id_crime
            inner join weapon wpn 			on wcc.id_weapon = wpn.id_weapon
            inner join criminal_crime ccc 	on cri.id_crime = ccc.id_crime
            inner join criminal crm		 	on ccc.id_criminal = crm.id_criminal` + filter, res);
    },

    showWeapons(req, res){
        let filter = '';
        if (req.params.id) filter = ' where id_crime=' + parseInt(req.params.id);
        this.executeQuery(
            `select distinct wpn.tx_model as 'WEAPON'
            from weapon_crime wcc
            inner join weapon wpn on wcc.id_weapon = wpn.id_weapon` + filter, res);
    },

    insertCrime(req, res){

    }


}