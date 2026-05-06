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
            kfsr, kcsr, kvr, kosgu, kvfo,
            payment_plan_2026, payment_plan_2027, payment_plan_2028
        } = executionData;
    
        const query = `INSERT INTO des.execution 
            (kfsr, kcsr, kvr, kosgu, kvfo,
             payment_plan_2026, payment_plan_2027, payment_plan_2028) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    
        const values = [
            String(kfsr || ''), 
            String(kcsr || ''), 
            String(kvr || ''), 
            String(kosgu || ''), 
            String(kvfo || ''),
            Number(payment_plan_2026) || 0, 
            Number(payment_plan_2027) || 0, 
            Number(payment_plan_2028) || 0
        ];
    
        console.log('SQL INSERT:', query);
        console.log('Values:', values);
    
        return new Promise((resolve, reject) => {
            db.query(query, values, (error, res) => {
                if (error) {
                    console.error('Ошибка INSERT:', error);
                    reject(error);
                } else {
                    resolve(res);
                }
            });
        });
    }

    static async update(id, executionData) {
        const {
            kfsr, kcsr, kvr, kosgu, kvfo,
            payment_plan_2026, payment_plan_2027, payment_plan_2028
        } = executionData;
    
        const query = `UPDATE des.execution SET 
            kfsr = ?, kcsr = ?, kvr = ?, kosgu = ?, kvfo = ?,
            payment_plan_2026 = ?, payment_plan_2027 = ?, payment_plan_2028 = ?
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
            id
        ];
    
        return new Promise((resolve, reject) => {
            db.query(query, values, (error, res) => {
                if (error) {
                    console.error('Ошибка UPDATE:', error);
                    reject(error);
                } else {
                    resolve(res);
                }
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
     
export default ExecutionModule;