import db from '../config/database.js';

class SummaryModule {

    static async getAll() {
        const query = "SELECT * FROM des.contracts ORDER BY id DESC";
    
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
}
     
export default SummaryModule;