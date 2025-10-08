import db from '../config/database.js';

class PhoneBookModel{

    static async getAll() {
        const query = "SELECT * FROM des.phone_boock";
        
        return new Promise((resolve, reject) => {
            db.query(query, (error, result) => {
                if (error) reject(error);
                else resolve(result);
            });
        });
      }

    static async create(phoneBookData){
        const { fcs, post, phone_number, email, addres, deport } = phoneBookData;
        const query = "INSERT INTO des.phone_boock (`fcs`, `post`, `phone_number`, `email`, `addres`, `deport`) VALUES (?,?,?,?,?,?)";
    
        return new Promise((resolve,reject)=>{
            db.query(query , [fcs, post, phone_number, email, addres, deport], (error, res) => {
                if(error) reject(error);
                else resolve(res);
            });
        });  
    }

    static async update(id, phoneBookData) {
    
        const { fcs, post, phone_number, email, addres, deport } = phoneBookData;
        const query = 'UPDATE des.phone_boock SET `fcs` = ?, `post` = ?, `phone_number` = ?, `email` = ?, `addres` = ?, `deport` = ? WHERE (`id` = ?)';
        
        return new Promise((resolve, reject) => {
            db.query(query, [fcs, post, phone_number, email, addres, deport, id], (error, res) => {
                if (error)  reject(error);
                else resolve(res);
            });
        });
    }

    static async delete(id){
        const query = 'DELETE FROM des.phone_boock WHERE id = ?';

        return new Promise((resolve,reject)=>{
            db.query(query, id, (error, res)=>{
                if(error) reject(error);
                else resolve(res);
            });
        });
    }
}

export default PhoneBookModel;