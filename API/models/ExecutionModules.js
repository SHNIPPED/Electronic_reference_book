import { query } from '../config/database.js';

class ExecutionModule {

    static async getAll() {
        const sql = "SELECT * FROM des.execution";
        return await query(sql);
    }

    static async create(executionData) {
        const {
            kfsr, kcsr, kvr, kosgu, kvfo,
            payment_plan_2026, payment_plan_2027, payment_plan_2028, Industry_code
        } = executionData;
    
        const sql = `INSERT INTO des.execution 
            (kfsr, kcsr, kvr, kosgu, kvfo,
             payment_plan_2026, payment_plan_2027, payment_plan_2028 , Industry_code) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
        const values = [
            String(kfsr || ''), 
            String(kcsr || ''), 
            String(kvr || ''), 
            String(kosgu || ''), 
            String(kvfo || ''),
            Number(payment_plan_2026) || 0, 
            Number(payment_plan_2027) || 0, 
            Number(payment_plan_2028) || 0,
            String(Industry_code || ' ')
        ];
    
        console.log('SQL INSERT:', sql);
        console.log('Values:', values);
    
        return await query(sql, values);
    }

    static async update(id, executionData) {
        const {
            kfsr, kcsr, kvr, kosgu, kvfo,
            payment_plan_2026, payment_plan_2027, payment_plan_2028,Industry_code
        } = executionData;
    
        const sql = `UPDATE des.execution SET 
            kfsr = ?, kcsr = ?, kvr = ?, kosgu = ?, kvfo = ?,
            payment_plan_2026 = ?, payment_plan_2027 = ?, 
            payment_plan_2028 = ?, Industry_code = ?
            WHERE id = ?`;
    
        const values = [
            String(kfsr || ''), 
            String(kcsr || ''), 
            String(kvr || ''), 
            String(kosgu || ''), 
            String(kvfo || ''),
            Number(payment_plan_2026) || 0, 
            Number(payment_plan_2027) || 0, 
            Number(payment_plan_2028) || 0,
            String(Industry_code || ' '),
            id
        ];
    
        console.log('SQL UPDATE:', sql);
        console.log('Values:', values);
    
        return await query(sql, values);
    }

    static async delete(id) {
        const sql = 'DELETE FROM des.execution WHERE id = ?';
        return await query(sql, [id]);
    }
}
     
export default ExecutionModule;