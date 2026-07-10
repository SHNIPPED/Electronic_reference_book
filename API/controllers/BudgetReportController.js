import ExecutionModule from "../models/ExecutionModules.js";
import SummaryModule from "../models/SummaryModels.js";

class BudgetReportController {
    static async getHierarchicalReport(req, res) {
        try {
            const executions = await ExecutionModule.getAll();
            const contracts = await SummaryModule.getAll();
    
            const contractsByKey = new Map();
            contracts.forEach(contract => {
                const key = `${contract.kcsr || ''}|${contract.kvr || ''}|${contract.kosgu || ''}|${contract.kvfo || ''}|${contract.Industry_code || ''}`;
                if (!contractsByKey.has(key)) contractsByKey.set(key, []);
                contractsByKey.get(key).push(contract);
            });
    
            const flatRows = [];
            for (const exec of executions) {
                const parentId = `parent_${exec.id}`;
                const childKey = `${exec.kcsr || ''}|${exec.kvr || ''}|${exec.kosgu || ''}|${exec.kvfo || ''}|${exec.Industry_code || ''}`;
                const children = contractsByKey.get(childKey) || [];
    
                let totalExecCurrYear = 0;
                let totalCurrYearSum = 0;
                let totalAdvanceSum = 0;
                let totalApprovals2026 = 0;
                let totalObligations2027 = 0;
                let totalApprovals2027 = 0;
                let kcsrName = '';
    
                if (children.length > 0) {
                    kcsrName = children[0].osnovanie || '';
                    children.forEach(child => {
                        totalExecCurrYear += Number(child.exec_curr_year) || 0;
                        totalCurrYearSum += Number(child.curr_year_sum) || 0;
                        totalAdvanceSum += Number(child.advance_sum) || 0;
                        totalApprovals2026 += Number(child.approvals_2026) || 0;
                        totalObligations2027 += Number(child.obligations_2027) || 0;
                        totalApprovals2027 += Number(child.approvals_2027) || 0;
                    });
                }
    
                // Родительская строка
                flatRows.push({
                    id: parentId,
                    type: 'parent',
                    parentId: null,
                    kfsr: exec.kfsr,
                    kcsr: exec.kcsr,
                    kvr: exec.kvr,
                    kosgu: exec.kosgu,
                    kvfo: exec.kvfo,
                    counterparty: '',
                    doc_date: null,
                    start_date: null,
                    exec_date: null,
                    end_date: null,
                    plan_2026: Number(exec.payment_plan_2026) || 0,
                    plan_2027: Number(exec.payment_plan_2027) || 0,
                    obligations_2026: totalCurrYearSum,
                    in_execution: '',
                    paid_total: totalExecCurrYear,
                    balance_remain: totalCurrYearSum - totalExecCurrYear,
                    approvals_2026: totalApprovals2026,
                    obligations_2027: totalObligations2027,
                    approvals_2027: totalApprovals2027,
                    advance_sum: totalAdvanceSum,
                    kcsr_name: '',
                    Industry_code: exec.Industry_code,
                });
    
                // Дочерние строки - добавляем parentId
                children.forEach(child => {
                    const childCurrYearSum = Number(child.curr_year_sum) || 0;
                    const childExecCurrYear = Number(child.exec_curr_year) || 0;
                    const childAdvance = Number(child.advance_sum) || 0;
                    const childBalanceRemain = childCurrYearSum - childExecCurrYear;
    
                    flatRows.push({
                        id: `child_${child.id}_${exec.id}`,
                        type: 'child',
                        parentId: parentId,
                        kfsr: child.kfsr,
                        kcsr: child.doc_num,
                        kcsr_name: child.osnovanie || '',
                        kvr: child.kvr,
                        kosgu: child.kosgu,
                        kvfo: child.kvfo,
                        counterparty: child.counterparty,
                        doc_date: child.doc_date,
                        start_date: child.start_date,
                        exec_date: child.exec_date,
                        end_date: child.end_date,
                        plan_2026: '',
                        plan_2027: '',
                        obligations_2026: childCurrYearSum,
                        in_execution: child.in_execution,
                        paid_total: childExecCurrYear,
                        balance_remain: childBalanceRemain,
                        approvals_2026: child.approvals_2026 || 0,
                        obligations_2027: child.obligations_2027 || 0,
                        approvals_2027: child.approvals_2027 || 0,
                        advance_sum: childAdvance,
                        Industry_code: child.Industry_code,
                    });
                });
            }
    
            return res.status(200).json({ report: flatRows });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Ошибка сервера" });
        }
    }
}

export default BudgetReportController;