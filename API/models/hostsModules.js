import db from '../config/database.js';

class HostsModule{
    static async getAll(){
        const query = "SELECT * FROM des.hosts";

        return new Promise((resolve,reject)=>{
            db.query(query,(error,result)=>{
                if(error) reject(error);
                else resolve(result);
            });
        });
    }

    static async create(hostData){
        const{fcs, host} = hostData;
        const query = "INSERT INTO `des`.`hosts` (`fcs`, `host`) VALUES (?, ?);";

        return new Promise((resolve,reject)=>{
            db.query(query,[fcs, host],(error,res) =>{
                if(error) reject(error);
                else resolve(res);
            });
        });
    }

    static async update(id,hostData){
        const { fcs, host } = hostData;
        const query = 'UPDATE des.hosts SET `fcs` = ?, `host` = ? WHERE (`id` = ?);';

        return new Promise((resolve,reject)=>{
            db.query(query,[fcs, host, id],(error,res) =>{
                if(error) reject(error);
                else resolve(res);
            });
        });
    }

    static async delete(id){ 
        const query = 'DELETE FROM des.hosts WHERE id = ?';

        return new Promise((resolve,reject)=>{
            db.query(query, id, (error, res)=>{
                if(error) reject(error);
                else resolve(res);
            });
        });
    }
}

export default HostsModule;