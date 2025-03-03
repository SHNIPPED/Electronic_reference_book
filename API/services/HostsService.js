import Hosts from '../models/Hosts.js'

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "des",
    password: "Asdfg123"
});

class HostsService{

    async getAll() {
        const _Hosts = await connection.query('SELECT * FROM des.hosts');
        return _Hosts;
    }
}

export default new HostsService()