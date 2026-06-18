import {query} from '../config/database.js';

class PhoneBookModel {

    static async getAll() {
        const sql = "SELECT * FROM des.phone_boock";
        return await query(sql);
    }

    static async create(phoneBookData) {
        const { fcs, post, phone_number, email, addres, deport } = phoneBookData;
        const sql = "INSERT INTO des.phone_boock (`fcs`, `post`, `phone_number`, `email`, `addres`, `deport`) VALUES (?,?,?,?,?,?)";
        return await query(sql, [fcs, post, phone_number, email, addres, deport]);
    }

    static async update(id, phoneBookData) {
        const { fcs, post, phone_number, email, addres, deport } = phoneBookData;
        const sql = "UPDATE des.phone_boock SET `fcs` = ?, `post` = ?, `phone_number` = ?, `email` = ?, `addres` = ?, `deport` = ? WHERE `id` = ?";
        return await query(sql, [fcs, post, phone_number, email, addres, deport, id]);
    }

    static async delete(id) {
        const sql = "DELETE FROM des.phone_boock WHERE id = ?";
        return await query(sql, [id]); 
    }
}

export default PhoneBookModel;