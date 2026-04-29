import db from '../config/database.js';

class SummaryModule {

    static async getAll() {
        const query = "SELECT * FROM des.contracts";

        return new Promise((resolve, reject) => {
            db.query(query, (error, result) => {
                if (error) reject(error);
                else resolve(result);
            });
        });
    }

    static async create(summaryData) {
        const {
            doc_num, doc_status, doc_date, reg_date, accept_date, exec_date,
            total_sum, contract_type, counterparty, contract_sum, curr_year_sum,
            exec_curr_year, exec_past_periods, in_execution, advance_sum,
            balance, total_balance, is_attached, base_doc_date, start_date, end_date
        } = summaryData;

        const query = `INSERT INTO des.contracts 
            (doc_num, doc_status, doc_date, reg_date, accept_date, exec_date, 
             total_sum, contract_type, counterparty, contract_sum, curr_year_sum,
             exec_curr_year, exec_past_periods, in_execution, advance_sum, 
             balance, total_balance, is_attached, base_doc_date, start_date, end_date) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        return new Promise((resolve, reject) => {
            db.query(query, [
                doc_num, doc_status, doc_date, reg_date, accept_date, exec_date,
                total_sum, contract_type, counterparty, contract_sum, curr_year_sum,
                exec_curr_year, exec_past_periods, in_execution, advance_sum,
                balance, total_balance, is_attached, base_doc_date, start_date, end_date
            ], (error, res) => {
                if (error) reject(error);
                else resolve(res);
            });
        });
    }

    static async update(id, summaryData) {
        const {
            doc_num, doc_status, doc_date, reg_date, accept_date, exec_date,
            total_sum, contract_type, counterparty, contract_sum, curr_year_sum,
            exec_curr_year, exec_past_periods, in_execution, advance_sum,
            balance, total_balance, is_attached, base_doc_date, start_date, end_date
        } = summaryData;

        const query = `UPDATE des.contracts SET 
            doc_num = ?, doc_status = ?, doc_date = ?, reg_date = ?, accept_date = ?, 
            exec_date = ?, total_sum = ?, contract_type = ?, counterparty = ?, 
            contract_sum = ?, curr_year_sum = ?, exec_curr_year = ?, exec_past_periods = ?, 
            in_execution = ?, advance_sum = ?, balance = ?, total_balance = ?, 
            is_attached = ?, base_doc_date = ?, start_date = ?, end_date = ? 
            WHERE id = ?`;

        return new Promise((resolve, reject) => {
            db.query(query, [
                doc_num, doc_status, doc_date, reg_date, accept_date, exec_date,
                total_sum, contract_type, counterparty, contract_sum, curr_year_sum,
                exec_curr_year, exec_past_periods, in_execution, advance_sum,
                balance, total_balance, is_attached, base_doc_date, start_date, end_date,
                id
            ], (error, res) => {
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

export default SummaryModule