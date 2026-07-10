import { query } from '../config/database.js';

class SummaryModule {

    static async getAll() {
        const sql = `
        SELECT c.*,
                ca.id AS service_id,
                ca.approvals_2026, 
                ca.obligations_2027, 
                ca.approvals_2027,
                COALESCE(s.total_in_execution, 0) AS in_execution
        FROM des.contracts c
        LEFT JOIN des.contract_additional ca ON c.id = ca.contract_id
        LEFT JOIN (
            SELECT doc_num, kcsr, kvr, kosgu, kvfo, SUM(in_execution) AS total_in_execution
            FROM des.summary
            GROUP BY doc_num, kcsr, kvr, kosgu, kvfo
        ) s ON c.doc_num = s.doc_num 
           AND COALESCE(c.kcsr, '') = COALESCE(s.kcsr, '')
           AND COALESCE(c.kvr, '') = COALESCE(s.kvr, '')
           AND COALESCE(c.kosgu, '') = COALESCE(s.kosgu, '')
           AND COALESCE(c.kvfo, '') = COALESCE(s.kvfo, '')
        ORDER BY c.id DESC
    `;
        return await query(sql);
    }
    
    static async create(contractData) {
        const {
            doc_num, doc_status, doc_date, reg_date, exec_date,
            total_sum, contract_type, counterparty, contract_sum, curr_year_sum,
            exec_curr_year, exec_past_periods, in_execution, advance_sum,
            balance, total_balance, base_doc_date, start_date, end_date,
            osnovanie, kcsr, kvr, kosgu, kvfo, Industry_code, note
        } = contractData;
    
        const sql = `INSERT INTO des.contracts 
            (doc_num, doc_status, doc_date, reg_date, exec_date,
             total_sum, contract_type, counterparty, contract_sum, curr_year_sum,
             exec_curr_year, exec_past_periods, in_execution, advance_sum,
             balance, total_balance, base_doc_date, start_date, end_date,
             osnovanie, kcsr, kvr, kosgu, kvfo, Industry_code, note) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
        const values = [
            doc_num || '', doc_status || '', doc_date || null, reg_date || null, exec_date || null,
            total_sum || 0, contract_type || '', counterparty || '', contract_sum || 0, curr_year_sum || 0,
            exec_curr_year || 0, exec_past_periods || 0, in_execution || 0, advance_sum || 0,
            balance || 0, total_balance || 0, base_doc_date || null, start_date || null, end_date || null,
            osnovanie || '', kcsr || '', kvr || '', kosgu || '', kvfo || '' , Industry_code || '' , note || ' '
        ];
    
        try {
            return await query(sql, values);
        } catch (error) {
            console.error('Ошибка INSERT в contracts:', error);
            throw error;
        }
    }

    static async createSummary(contractData) {
        const {
            doc_num, kcsr, kvr, kosgu, kvfo, in_execution
        } = contractData;
    
        const sql = `INSERT INTO des.summary 
            (doc_num, kcsr, kvr, kosgu, kvfo, in_execution) 
            VALUES (?, ?, ?, ?, ?, ?)`;
        const values = [
            doc_num || '',kcsr || '', kvr || '', kosgu || '', kvfo || '', in_execution || 0, 
        ];
    
        try {
            return await query(sql, values);
        } catch (error) {
            console.error('Ошибка INSERT в summary:', error);
            throw error;
        }
    }

    static async deleteAllSummary() {
        const sql = `TRUNCATE TABLE des.summary`;
        try {
            return await query(sql);
        } catch (error) {
            console.error('Ошибка удаления', error);
            throw error;
        }
    }

    
    
    static async update(id, contractData) {
        const {
            doc_num, doc_status, doc_date, reg_date, exec_date,
            total_sum, contract_type, counterparty, contract_sum, curr_year_sum,
            exec_curr_year, exec_past_periods, in_execution, advance_sum,
            balance, total_balance, base_doc_date, start_date, end_date,
            osnovanie, kcsr, kvr, kosgu, kvfo, Industry_code,
        } = contractData;

        const sql = `UPDATE des.contracts SET 
                    doc_num = ?, doc_status = ?, doc_date = ?, reg_date = ?, 
                    exec_date = COALESCE(NULLIF(?, ''), exec_date),
                    total_sum = ?, contract_type = ?, counterparty = ?, 
                    contract_sum = ?, curr_year_sum = ?, exec_curr_year = ?, 
                    exec_past_periods = ?, in_execution = ?, advance_sum = ?, 
                    balance = ?, total_balance = ?, base_doc_date = ?, 
                    start_date = ?, end_date = ?, osnovanie = ?, kcsr = ?, kvr = ?, kosgu = ?, kvfo = ?, Industry_code = ?
                    WHERE id = ?`;
    
        const values = [
            doc_num || '', doc_status || '', doc_date || null, reg_date || null, exec_date || null,
            total_sum || 0, contract_type || '', counterparty || '', contract_sum || 0, curr_year_sum || 0,
            exec_curr_year || 0, exec_past_periods || 0, in_execution || 0, advance_sum || 0,
            balance || 0, total_balance || 0, base_doc_date || null, start_date || null, end_date || null,
            osnovanie || '', kcsr || '', kvr || '', kosgu || '', kvfo || '', Industry_code || '', id
        ];
    
        try {
            return await query(sql, values);
        } catch (error) {
            console.error('Ошибка UPDATE в contracts:', error);
            throw error;
        }
    }

    static async updateSingle(id, contractData) {
        const {
            doc_num, doc_status, doc_date, reg_date, exec_date,
            total_sum, contract_type, counterparty, contract_sum, curr_year_sum,
            exec_curr_year, exec_past_periods, in_execution, advance_sum,
            balance, total_balance, base_doc_date, start_date, end_date,
            osnovanie, kcsr, kvr, kosgu, kvfo, Industry_code, note,
        } = contractData;
    
        const sql = `UPDATE des.contracts SET 
            doc_num = ?, doc_status = ?, doc_date = ?, reg_date = ?, 
            exec_date = ?, total_sum = ?, contract_type = ?, counterparty = ?, 
            contract_sum = ?, curr_year_sum = ?, exec_curr_year = ?, 
            exec_past_periods = ?, in_execution = ?, advance_sum = ?, 
            balance = ?, total_balance = ?, base_doc_date = ?, 
            start_date = ?, end_date = ?, osnovanie = ?, kcsr = ?, kvr = ?, kosgu = ?, kvfo = ?, Industry_code = ?, note = ?
            WHERE id = ?`;
    
        const values = [
            doc_num || '', doc_status || '', doc_date || null, reg_date || null, exec_date || null,
            total_sum || 0, contract_type || '', counterparty || '', contract_sum || 0, curr_year_sum || 0,
            exec_curr_year || 0, exec_past_periods || 0, in_execution || 0, advance_sum || 0,
            balance || 0, total_balance || 0, base_doc_date || null, start_date || null, end_date || null,
            osnovanie || '', kcsr || '', kvr || '', kosgu || '', kvfo || '', Industry_code || '', note || '', id
        ];
    
        try {
            return await query(sql, values);
        } catch (error) {
            console.error('Ошибка UPDATE в contracts:', error);
            throw error;
        }
    }
    
    static async delete(id) {
        const sql = 'DELETE FROM des.contracts WHERE id = ?';
        return await query(sql, [id]);
    }

    static async updateExecDate(id, exec_date) {
        const sql = 'UPDATE des.contracts SET exec_date = ? WHERE id = ?';
        return await query(sql, [exec_date || null, id]);
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
            
            const sql = `
                INSERT INTO des.contract_additional (contract_id, ${fields.join(', ')})
                VALUES (?, ${placeholders})
                ON DUPLICATE KEY UPDATE ${setClause}
            `;
            
            const values = [id, ...fields.map(f => updateData[f])];
            
            return await query(sql, values);
        } catch (error) {
            console.error('Error in updateContractFields:', error);
            throw error;
        }
    }
    
    static async createContractAdditional(data) {
        const { contract_id, approvals_2026, obligations_2027, approvals_2027 } = data;
        const sql = `INSERT INTO des.contract_additional 
            (contract_id, approvals_2026, obligations_2027, approvals_2027) 
            VALUES (?, ?, ?, ?)`;
        return await query(sql, [contract_id, approvals_2026 || 0, obligations_2027 || 0, approvals_2027 || 0]);
    }
    
    static async updateContractAdditional(id, data) {
        const { approvals_2026, obligations_2027, approvals_2027 } = data;
        const sql = `UPDATE des.contract_additional SET 
            approvals_2026 = ?, obligations_2027 = ?, approvals_2027 = ? 
            WHERE id = ?`;
        return await query(sql, [approvals_2026 || 0, obligations_2027 || 0, approvals_2027 || 0, id]);
    }

    static async deleteContractAdditionalByContractId(contractId) {
        const sql = 'DELETE FROM des.contract_additional WHERE contract_id = ?';
        return await query(sql, [contractId]);
    }    

    static async  updateExecution (id,data){
        const sql = 'UPDATE `des`.`contracts` SET `in_execution` = ? WHERE (`id` = ?);';
        return await query(sql, [contractId]);
    }
}
     
export default SummaryModule;