import db from '../config/database.js';

class ExecutionModule {

        static async getAll() {
            const query = "SELECT * FROM des.execution";
    
            return new Promise((resolve, reject) => {
                db.query(query, (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                });
            });
        }
    
        static async create(executionData) {
            const {
                budget, document_status, document_number, document_date, type,
                approval_date, registration_date, change_registration_date,
                archive_send_date, institution, founder, structure,
                balance_start_year1, balance_start_year2, balance_start_year3,
                balance_end_year1, balance_end_year2, balance_end_year3,
                income_year1, income_year2, income_year3,
                payment_year1, payment_year2, payment_year3,
                income_beyond_planning, comment, ep_ed_count, ep_attached_count
            } = executionData;
    
            const query = `INSERT INTO des.execution 
                (budget, document_status, document_number, document_date, type,
                 approval_date, registration_date, change_registration_date,
                 archive_send_date, institution, founder, structure,
                 balance_start_year1, balance_start_year2, balance_start_year3,
                 balance_end_year1, balance_end_year2, balance_end_year3,
                 income_year1, income_year2, income_year3,
                 payment_year1, payment_year2, payment_year3,
                 income_beyond_planning, comment, ep_ed_count, ep_attached_count) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
            return new Promise((resolve, reject) => {
                db.query(query, [
                    budget, document_status, document_number, document_date, type,
                    approval_date, registration_date, change_registration_date,
                    archive_send_date, institution, founder, structure,
                    balance_start_year1, balance_start_year2, balance_start_year3,
                    balance_end_year1, balance_end_year2, balance_end_year3,
                    income_year1, income_year2, income_year3,
                    payment_year1, payment_year2, payment_year3,
                    income_beyond_planning, comment, ep_ed_count, ep_attached_count
                ], (error, res) => {
                    if (error) reject(error);
                    else resolve(res);
                });
            });
        }
    
        static async update(id, executionData) {
            const {
                budget, document_status, document_number, document_date, type,
                approval_date, registration_date, change_registration_date,
                archive_send_date, institution, founder, structure,
                balance_start_year1, balance_start_year2, balance_start_year3,
                balance_end_year1, balance_end_year2, balance_end_year3,
                income_year1, income_year2, income_year3,
                payment_year1, payment_year2, payment_year3,
                income_beyond_planning, comment, ep_ed_count, ep_attached_count
            } = executionData;
    
            const query = `UPDATE des.execution SET 
                budget = ?, document_status = ?, document_number = ?, document_date = ?, 
                type = ?, approval_date = ?, registration_date = ?, 
                change_registration_date = ?, archive_send_date = ?, institution = ?, 
                founder = ?, structure = ?, balance_start_year1 = ?, balance_start_year2 = ?, 
                balance_start_year3 = ?, balance_end_year1 = ?, balance_end_year2 = ?, 
                balance_end_year3 = ?, income_year1 = ?, income_year2 = ?, income_year3 = ?, 
                payment_year1 = ?, payment_year2 = ?, payment_year3 = ?, 
                income_beyond_planning = ?, comment = ?, ep_ed_count = ?, ep_attached_count = ? 
                WHERE id = ?`;
    
    return new Promise((resolve, reject) => {
                db.query(query, [
                    budget, document_status, document_number, document_date, type,
                    approval_date, registration_date, change_registration_date,
                    archive_send_date, institution, founder, structure,
                    balance_start_year1, balance_start_year2, balance_start_year3,
                    balance_end_year1, balance_end_year2, balance_end_year3,
                    income_year1, income_year2, income_year3,
                    payment_year1, payment_year2, payment_year3,
                    income_beyond_planning, comment, ep_ed_count, ep_attached_count,
                    id
                ], (error, res) => {
                    if (error) reject(error);
                    else resolve(res);
                });
            });
        }
    
        static async delete(id) {
            const query = 'DELETE FROM des.execution WHERE id = ?';
    
            return new Promise((resolve, reject) => {
                db.query(query, [id], (error, res) => {
                    if (error) reject(error);
                    else resolve(res);
                });
            });
        }
}
     
export default ExecutionModule