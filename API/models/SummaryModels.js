import db from '../config/database.js';

class SummaryModule {

    static async getAll() {
        const query = `SELECT c.*, 
            ca.approvals_2026, 
            ca.obligations_2027, 
            ca.approvals_2027
            FROM des.contracts c
            LEFT JOIN des.contract_additional ca ON c.id = ca.contract_id
            ORDER BY c.id DESC`;
        
        return new Promise((resolve, reject) => {
            db.query(query, (error, result) => {
                if (error) reject(error);
                else resolve(result);
            });
        });
    }
    
    static async create(contractData) {
        const {
            doc_num, doc_status, doc_date, reg_date, exec_date,
            total_sum, contract_type, counterparty, contract_sum, curr_year_sum,
            exec_curr_year, exec_past_periods, in_execution, advance_sum,
            balance, total_balance, base_doc_date, start_date, end_date,
            osnovanie, kcsr, kvr, kosgu, kvfo
        } = contractData;
    
        const query = `INSERT INTO des.contracts 
            (doc_num, doc_status, doc_date, reg_date, exec_date,
             total_sum, contract_type, counterparty, contract_sum, curr_year_sum,
             exec_curr_year, exec_past_periods, in_execution, advance_sum,
             balance, total_balance, base_doc_date, start_date, end_date,
             osnovanie, kcsr, kvr, kosgu, kvfo) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
        const values = [
            doc_num || '', doc_status || '', doc_date || null, reg_date || null, exec_date || null,
            total_sum || 0, contract_type || '', counterparty || '', contract_sum || 0, curr_year_sum || 0,
            exec_curr_year || 0, exec_past_periods || 0, in_execution || 0, advance_sum || 0,
            balance || 0, total_balance || 0, base_doc_date || null, start_date || null, end_date || null,
            osnovanie || '', kcsr || '', kvr || '', kosgu || '', kvfo || ''
        ];
    
        return new Promise((resolve, reject) => {
            db.query(query, values, (error, res) => {
                if (error) {
                    console.error('Ошибка INSERT в contracts:', error);
                    reject(error);
                } else {
                    resolve(res);
                }
            });
        });
    }
    
    static async update(id, contractData) {
        const {
            doc_num, doc_status, doc_date, reg_date, exec_date,
            total_sum, contract_type, counterparty, contract_sum, curr_year_sum,
            exec_curr_year, exec_past_periods, in_execution, advance_sum,
            balance, total_balance, base_doc_date, start_date, end_date,
            osnovanie, kcsr, kvr, kosgu, kvfo
        } = contractData;
    
        const query = `UPDATE des.contracts SET 
            doc_num = ?, doc_status = ?, doc_date = ?, reg_date = ?, 
            exec_date = ?, total_sum = ?, contract_type = ?, counterparty = ?, 
            contract_sum = ?, curr_year_sum = ?, exec_curr_year = ?, 
            exec_past_periods = ?, in_execution = ?, advance_sum = ?, 
            balance = ?, total_balance = ?, base_doc_date = ?, 
            start_date = ?, end_date = ?, osnovanie = ?, kcsr = ?, kvr = ?, kosgu = ?, kvfo = ? 
            WHERE id = ?`;
    
        const values = [
            doc_num || '', doc_status || '', doc_date || null, reg_date || null, exec_date || null,
            total_sum || 0, contract_type || '', counterparty || '', contract_sum || 0, curr_year_sum || 0,
            exec_curr_year || 0, exec_past_periods || 0, in_execution || 0, advance_sum || 0,
            balance || 0, total_balance || 0, base_doc_date || null, start_date || null, end_date || null,
            osnovanie || '', kcsr || '', kvr || '', kosgu || '', kvfo || '', id
        ];
    
        return new Promise((resolve, reject) => {
            db.query(query, values, (error, res) => {
                if (error) {
                    console.error('Ошибка UPDATE в contracts:', error);
                    reject(error);
                } else {
                    resolve(res);
                }
            });
        });
    }
    
    static async delete(id) {
        const query = 'DELETE FROM des.contracts WHERE id = ?';
    
        return new Promise((resolve, reject) => {
            db.query(query, [id], (error, res) => {
                if (error) reject(error);
                else resolve(res);
            });
        });
    }

    static async updateExecDate(id, exec_date) {
        const query = 'UPDATE des.contracts SET exec_date = ? WHERE id = ?';
        const values = [exec_date || null, id];
    
        return new Promise((resolve, reject) => {
            db.query(query, values, (error, res) => {
                if (error) reject(error);
                else resolve(res);
            });
        });
    }

    static async updateContractFields(id, updates) {
        try {
            const updateData = {};
            
            if (updates.approvals_2026 !== undefined) updateData.approvals_2026 = updates.approvals_2026;
            if (updates.obligations_2027 !== undefined) updateData.obligations_2027 = updates.obligations_2027;
            if (updates.approvals_2027 !== undefined) updateData.approvals_2027 = updates.approvals_2027;
            
            const fields = Object.keys(updateData);
            if (fields.length === 0) return { affectedRows: 0 };
            
            const setClause = fields.map(f => `${f} = VALUES(${f})`).join(', ');
            const placeholders = fields.map(() => '?').join(', ');
            
            const query = `
                INSERT INTO des.contract_additional (contract_id, ${fields.join(', ')})
                VALUES (?, ${placeholders})
                ON DUPLICATE KEY UPDATE ${setClause}
            `;
            
            const values = [id, ...fields.map(f => updateData[f])];
            
            return new Promise((resolve, reject) => {
                db.query(query, values, (error, res) => {
                    if (error) {
                        console.error('SQL error in updateContractFields:', error);
                        reject(error);
                    } else {
                        resolve(res);
                    }
                });
            });
        } catch (error) {
            console.error('Error in updateContractFields:', error);
            throw error;
        }
    }

    static async getContractAdditional(contractId) {
        const query = 'SELECT * FROM des.contract_additional WHERE contract_id = ?';
        return new Promise((resolve, reject) => {
            db.query(query, [contractId], (err, results) => {
                if (err) reject(err);
                else resolve(results[0] || null);
            });
        });
    }
    
    // Создать запись contract_additional
    static async createContractAdditional(data) {
        const { contract_id, approvals_2026, obligations_2027, approvals_2027 } = data;
        const query = `INSERT INTO des.contract_additional 
            (contract_id, approvals_2026, obligations_2027, approvals_2027) 
            VALUES (?, ?, ?, ?)`;
        const values = [contract_id, approvals_2026 || 0, obligations_2027 || 0, approvals_2027 || 0];
        return new Promise((resolve, reject) => {
            db.query(query, values, (err, res) => {
                if (err) reject(err);
                else resolve(res);
            });
        });
    }
    
    // Обновить запись contract_additional по id
    static async updateContractAdditional(id, data) {
        const { approvals_2026, obligations_2027, approvals_2027 } = data;
        const query = `UPDATE des.contract_additional SET 
            approvals_2026 = ?, obligations_2027 = ?, approvals_2027 = ? 
            WHERE id = ?`;
        const values = [approvals_2026 || 0, obligations_2027 || 0, approvals_2027 || 0, id];
        return new Promise((resolve, reject) => {
            db.query(query, values, (err, res) => {
                if (err) reject(err);
                else resolve(res);
            });
        });
    }

    static async deleteContractAdditionalByContractId(contractId) {
        const query = 'DELETE FROM des.contract_additional WHERE contract_id = ?';
        return new Promise((resolve, reject) => {
            db.query(query, [contractId], (err, res) => {
                if (err) reject(err);
                else resolve(res);
            });
        });
    }    
}
     
export default SummaryModule;