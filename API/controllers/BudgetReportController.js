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
                    invoices: '',
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
                        invoices: '',
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

    static async updateExecDate(req, res) {
        try {
            const { id } = req.params;
            const { exec_date } = req.body;
            
            let contractId = id;
            if (typeof id === 'string') {
                const match = id.match(/child_(\d+)/);
                if (match) {
                    contractId = match[1];
                }
            }
            
            if (isNaN(contractId)) {
                return res.status(400).json({ message: 'Некорректный ID контракта' });
            }
            
            const result = await SummaryModule.updateExecDate(contractId, exec_date);
            
            if (result && result.affectedRows > 0) {
                return res.status(200).json({
                    message: `Обновлена дата исполнения для контракта ${contractId}`,
                    affectedRows: result.affectedRows
                });
            } else {
                return res.status(404).json({ message: 'Контракт не найден' });
            }
        } catch (error) {
            console.error('Ошибка при обновлении exec_date:', error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    static async updateContractField(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;
            
            let contractId = id;
            if (typeof id === 'string') {
                const match = id.match(/child_(\d+)/);
                if (match) {
                    contractId = match[1];
                }
            }
            
            if (isNaN(contractId)) {
                return res.status(400).json({ message: 'Некорректный ID контракта' });
            }
            
            const result = await SummaryModule.updateContractFields(contractId, updates);
            
            if (result && result.affectedRows > 0) {
                return res.status(200).json({
                    message: `Обновлены поля контракта ${contractId}`,
                    affectedRows: result.affectedRows
                });
            } else {
                return res.status(404).json({ message: 'Контракт не найден' });
            }
        } catch (error) {
            console.error('Ошибка при обновлении полей контракта:', error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    static async exportReportToExcel(req, res) {
        try {
            const executions = await ExecutionModule.getAll();
            const contracts = await SummaryModule.getAll();

            const contractsByKey = new Map();
            contracts.forEach(contract => {
                const key = `${contract.kcsr || ''}|${contract.kvr || ''}|${contract.kosgu || ''}|${contract.kvfo || ''}`;
                if (!contractsByKey.has(key)) contractsByKey.set(key, []);
                contractsByKey.get(key).push(contract);
            });

            const flatRows = [];
            for (const exec of executions) {
                const childKey = `${exec.kcsr || ''}|${exec.kvr || ''}|${exec.kosgu || ''}|${exec.kvfo || ''}`;
                const children = contractsByKey.get(childKey) || [];

                let kcsrName = '';
                let totalApprovals2026 = 0;
                let totalObligations2027 = 0;
                let totalApprovals2027 = 0;
                
                if (children.length > 0) {
                    kcsrName = children[0].osnovanie || '';
                    children.forEach(child => {
                        totalApprovals2026 += Number(child.approvals_2026) || 0;
                        totalObligations2027 += Number(child.obligations_2027) || 0;
                        totalApprovals2027 += Number(child.approvals_2027) || 0;
                    });
                }

                flatRows.push({
                    "КФСР": exec.kfsr || '',
                    "КЦСР": exec.kcsr || '',
                    "Наименование КЦСР": kcsrName,  
                    "КВР": exec.kvr || '',
                    "КОСГУ": exec.kosgu || '',
                    "КВФО": exec.kvfo || '',
                    "Организация контрагента": '',
                    "дата договора": '',
                    "начало оказания услуг": '',
                    "окончание оказания услуг (руками)": '',
                    "дата окончания договора": '',
                    "План 2026 год": exec.payment_plan_2026 || 0,
                    "Обязательства - Принято обязательств по расходам 2026": '',
                    "Выставлено счетов": '',
                    "Оплачено всего, в т.ч.": '',
                    "Остаток для исполнения": '',
                    "Согласование служебок 2026 год": totalApprovals2026,
                    "План 2027": exec.payment_plan_2027 || 0,
                    "Обязательства - Принято обязательств по расходам 2027": totalObligations2027,
                    "Согласование служебок 2027 год": totalApprovals2027,
                });

                children.forEach(child => {
                    flatRows.push({
                        "КФСР": child.kfsr || '',
                        "КЦСР": child.kcsr || '',
                        "Наименование КЦСР": '',
                        "КВР": child.kvr || '',
                        "КОСГУ": child.kosgu || '',
                        "КВФО": child.kvfo || '',
                        "Организация контрагента": child.counterparty,
                        "дата договора": child.doc_date ? new Date(child.doc_date).toLocaleDateString('ru-RU') : '',
                        "начало оказания услуг": child.start_date ? new Date(child.start_date).toLocaleDateString('ru-RU') : '',
                        "окончание оказания услуг (руками)": '',
                        "дата окончания договора": child.end_date ? new Date(child.end_date).toLocaleDateString('ru-RU') : '',
                        "План 2026 год": '',
                        "Обязательства - Принято обязательств по расходам 2026": '',
                        "Выставлено счетов": '',
                        "Оплачено всего, в т.ч.": '',
                        "Остаток для исполнения": '',
                        "Согласование служебок 2026 год": child.approvals_2026 || 0,
                        "План 2027": '',
                        "Обязательства - Принято обязательств по расходам 2027": child.obligations_2027 || 0,
                        "Согласование служебок 2027 год": child.approvals_2027 || 0,
                    });
                });
            }

            const XLSX = await import('xlsx');
            const ws = XLSX.utils.json_to_sheet(flatRows);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Лист1");
            const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

            res.setHeader('Content-Disposition', 'attachment; filename="report_structured.xlsx"');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.send(buffer);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Ошибка экспорта" });
        }
    }
}

export default BudgetReportController;