// Importação do modulo de conexão com o banco
const mariadb = require('mysql');

// Abertura da conexão com o banco
const connectionDb = mariadb.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

// Modulos exportados na chamada
module.exports = {
    // Modulo para Test de comunicação
    init(req, res){
        res.json({ 
            "mensagem": "A ATHON_API está pronta!",
            "author": "Douglas Damasio"
        });
    },

    // Modulo para execução deselect querys
    async executeQuery(req, res) {
        connectionDb.query(req, function(error, results, fields){
            if (error) res.json(error);
            else res.json(results);
        });
    },

    // Modulo para mostrar a lista de crimes
    showCrimes(req, res){
        let filter = '';
        if (req.params.id) filter = ' where cri.id_crime=' + parseInt(req.params.id);
        
        // Chama a execução passando a query
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

    // Modulo para mostrar a lista de armas utilizadas em algum crime
    showWeapons(req, res){
        let filter = '';
        if (req.params.id) filter = ' where id_crime=' + parseInt(req.params.id);
        this.executeQuery(
            `select distinct wpn.tx_model as 'WEAPON'
            from weapon_crime wcc
            inner join weapon wpn on wcc.id_weapon = wpn.id_weapon` + filter, res);
    },

    // Modulo para o insert de um crime
    async executeTransaction(req, res){
        connectionDb.beginTransaction(function(err){
            if (err) { throw err; }
            connectionDb.query(`insert into crime (tx_country, dt_crime) values ('${req.body.pais}', '${req.body.data}')`, function(err, result){
                if (err) {
                    connectionDb.rollback(function(){
                        throw err;
                    });
                }

                var log = result.insertId;

                connectionDb.query(`insert into victim(tx_name) select x.tx_name from (select '${req.body.vitima}' tx_name) x where not exists (select 1 from victim vt where vt.tx_name = x.tx_name)`, function(err, result){
                    if (err) {
                        connectionDb.rollback(function(){
                            throw err;
                        });
                    }

                    connectionDb.query(`insert into criminal(tx_name) select x.tx_name from (select '${req.body.criminoso}' tx_name) x where not exists (select 1 from criminal cr where cr.tx_name = x.tx_name)`, function(err, result){
                        if (err) {
                            connectionDb.rollback(function(){
                                throw err;
                            });
                        }

                        connectionDb.query(`insert into crime_type(tx_type) select x.tx_type from (select '${req.body.tipoCrime}' tx_type) x where not exists (select 1 from crime_type ct where ct.tx_type = x.tx_type)`, function(err, result){
                            if (err) {
                                connectionDb.rollback(function(){
                                    throw err;
                                });
                            }

                            connectionDb.query(`insert into weapon_type(tx_weapon_type) select x.tx_weapon_type from (select '${req.body.tipoArma}' tx_weapon_type) x where not exists (select 1 from weapon_type wt where wt.tx_weapon_type = x.tx_weapon_type)`, function(err, result){
                                if (err) {
                                    connectionDb.rollback(function(){
                                        throw err;
                                    });
                                }

                                connectionDb.query(`insert into weapon(tx_model, id_weapon_type) select x.tx_model, x.id_weapon_type from (select '${req.body.arma}' tx_model, (select id_weapon_type from weapon_type where tx_weapon_type = '${req.body.tipoArma}') id_weapon_type) x where not exists (select 1 from weapon wp, weapon_type wt where wp.tx_model = x.tx_model and wt.id_weapon_type = x.id_weapon_type)`, function(err, result){
                                    if (err) {
                                        connectionDb.rollback(function(){
                                            throw err;
                                        });
                                    }

                                    connectionDb.query(`insert into weapon_crime (id_weapon, id_crime) values ((select id_weapon from weapon where tx_model = '${req.body.arma}'), ${log})`, function(err, result){
                                        if (err) {
                                            connectionDb.rollback(function(){
                                                throw err;
                                            });
                                        }

                                        connectionDb.query(`insert into victim_crime (id_victim, id_crime) values ((select id_victim from victim where tx_name = '${req.body.vitima}'), ${log})`, function(err, result){
                                            if (err) {
                                                connectionDb.rollback(function(){
                                                    throw err;
                                                });
                                            }

                                            connectionDb.query(`insert into criminal_crime (id_criminal, id_crime, id_crime_type) values ((select id_criminal from criminal where tx_name = '${req.body.criminoso}'), ${log}, (select id_crime_type from crime_type where tx_type = '${req.body.tipoCrime}'))`, function(err, result){
                                                if (err) {
                                                    connectionDb.rollback(function(){
                                                        throw err;
                                                    });
                                                }

                                                connectionDb.commit(function(err){
                                                    if (err) {
                                                        connectionDb.rollback(function(){
                                                            throw err;
                                                        });
                                                    }

                                                    res.send('Transaction Complete!')
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    },

    // Modulo para Exclusão de um crime
    async deleteCrime(req, res){
        connectionDb.beginTransaction(function(err){
            if (err) { throw err; }
            connectionDb.query('delete from criminal_crime where id_crime =' + parseInt(req.params.id), function(err, result){
                if (err) {
                    connectionDb.rollback(function(){
                        throw err;
                    });
                }
                connectionDb.query('delete from victim_crime where id_crime =' + parseInt(req.params.id), function(err, result){
                    if (err) {
                        connectionDb.rollback(function(){
                            throw err;
                        });
                    }
                    connectionDb.query('delete from weapon_crime where id_crime =' + parseInt(req.params.id), function(err, result){
                        if (err) {
                            connectionDb.rollback(function(){
                                throw err;
                            });
                        }
                        connectionDb.query('delete from crime where id_crime =' + parseInt(req.params.id), function(err, result){
                            if (err) {
                                connectionDb.rollback(function(){
                                    throw err;
                                });
                            }
                            
                            connectionDb.commit(function(err){
                                if (err) {
                                    connectionDb.rollback(function(){
                                        throw err;
                                    });
                                }
                                res.send("Number of records deleted: " + result.affectedRows)
                            });
                        });
                    });
                });
            });
        });

    }
}
