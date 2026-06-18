import {query} from '../config/database.js';

class AuthModule {

    static async findByLogin(login) {
        const sql = 'SELECT * FROM des.user WHERE `name` = ?';
        return await query(sql, [login]);
    }
}
export default AuthModule;