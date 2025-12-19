import db from '../config/database.js';

class AuthModule{

    static async findByLogin(login) {
        
        const query = 'SELECT * FROM des.user WHERE `name` = ?';

        return new Promise((resolve,reject)=>{
            db.query(query,[login],(error,res) =>{
                if(error) reject(error);
                else resolve(res);
            });
        })
    }
}
export default AuthModule;