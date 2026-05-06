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
            total_sum, counterparty, contract_sum, curr_year_sum,
            exec_curr_year, exec_past_periods, in_execution, advance_sum,
            balance, total_balance, base_doc_date, start_date, end_date,
            osnovanie, kcsr, kvr, kvfo
        } = contractData;
    
        const query = `INSERT INTO des.contracts 
            (doc_num, doc_status, doc_date, reg_date, exec_date,
             total_sum, counterparty, contract_sum, curr_year_sum,
             exec_curr_year, exec_past_periods, in_execution, advance_sum,
             balance, total_balance, base_doc_date, start_date, end_date,
             osnovanie, kcsr, kvr, kvfo) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
        const values = [
            doc_num, doc_status, doc_date, reg_date, exec_date,
            total_sum, counterparty, contract_sum, curr_year_sum,
            exec_curr_year, exec_past_periods, in_execution, advance_sum,
            balance, total_balance, base_doc_date, start_date, end_date,
            osnovanie, kcsr, kvr, kvfo
        ];
    
        return new Promise((resolve, reject) => {
            db.query(query, values, (error, res) => {
                if (error) reject(error);
                else resolve(res);
            });
        });
    }
    
    static async update(id, contractData) {
        const {
            doc_num, doc_status, doc_date, reg_date, exec_date,
            total_sum, counterparty, contract_sum, curr_year_sum,
            exec_curr_year, exec_past_periods, in_execution, advance_sum,
            balance, total_balance, base_doc_date, start_date, end_date,
            osnovanie, kcsr, kvr, kvfo
        } = contractData;
    
        const query = `UPDATE des.contracts SET 
            doc_num = ?, doc_status = ?, doc_date = ?, reg_date = ?, 
            exec_date = ?, total_sum = ?, counterparty = ?, 
            contract_sum = ?, curr_year_sum = ?, exec_curr_year = ?, 
            exec_past_periods = ?, in_execution = ?, advance_sum = ?, 
            balance = ?, total_balance = ?, base_doc_date = ?, 
            start_date = ?, end_date = ?, osnovanie = ?, kcsr = ?, kvr = ?, kvfo = ? 
            WHERE id = ?`;
    
        const values = [
            doc_num, doc_status, doc_date, reg_date, exec_date,
            total_sum, counterparty, contract_sum, curr_year_sum,
            exec_curr_year, exec_past_periods, in_execution, advance_sum,
            balance, total_balance, base_doc_date, start_date, end_date,
            osnovanie, kcsr, kvr, kvfo, id
        ];
    
        return new Promise((resolve, reject) => {
            db.query(query, values, (error, res) => {
                if (error) reject(error);
                else resolve(res);
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