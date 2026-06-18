import { query } from '../config/database.js';

class HostsModule {

    static async getAll() {
        const sql = "SELECT * FROM des.hosts";
        return await query(sql);
    }

    static async create(hostData) {
        const { fcs, host } = hostData;
        const sql = "INSERT INTO `des`.`hosts` (`fcs`, `host`) VALUES (?, ?)";
        return await query(sql, [fcs, host]);
    }

    static async update(id, hostData) {
        const { fcs, host } = hostData;
        const sql = "UPDATE des.hosts SET `fcs` = ?, `host` = ? WHERE `id` = ?";
        return await query(sql, [fcs, host, id]);
    }

    static async delete(id) {
        const sql = "DELETE FROM des.hosts WHERE id = ?";
        return await query(sql, [id]);
    }
}

export default HostsModule;