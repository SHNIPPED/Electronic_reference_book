import ExecutionModule from "../models/ExecutionModules.js";
import SummaryModule from "../models/SummaryModels.js";

class BudgetReportController {
    static async getCombinedReport(req, res) {
        try {
            const executions = await ExecutionModule.getAll();      
            const contracts = await SummaryModule.getAll();        

            const map = new Map();
            executions.forEach(exec => {
                const key = `${exec.kcsr || ''}|${exec.kvr || ''}|${exec.kosgu || ''}|${exec.kvfo || ''}`;
                map.set(key, {
                    kfsr: exec.kfsr,
                    kcsr: exec.kcsr,
                    kvr: exec.kvr,
                    kosgu: exec.kosgu,
                    kvfo: exec.kvfo,
                    payment_plan_2026: exec.payment_plan_2026 || 0,
                    payment_plan_2027: exec.payment_plan_2027 || 0,
                    payment_plan_2028: exec.payment_plan_2028 || 0,
                    // Поля из контракта (пока пустые)
                    doc_num: null,
                    doc_status: null,
                    doc_date: null,
                    total_sum: 0,
                    counterparty: null,
                    contract_sum: 0,
                    curr_year_sum: 0,
                    exec_curr_year: 0,
                    exec_past_periods: 0,
                    in_execution: 0,
                    advance_sum: 0,
                    balance: 0,
                    total_balance: 0,
                    start_date: null,
                    end_date: null,
                    osnovanie: null
                });
            });

            // Добавляем контракты 
            contracts.forEach(contract => {
                const key = `${contract.kcsr || ''}|${contract.kvr || ''}|${contract.kosgu || ''}|${contract.kvfo || ''}`;
                if (map.has(key)) {
                    const exist = map.get(key);
                    // Обновляем поля из контракта
                    exist.doc_num = contract.doc_num;
                    exist.doc_status = contract.doc_status;
                    exist.doc_date = contract.doc_date;
                    exist.total_sum = contract.total_sum || 0;
                    exist.counterparty = contract.counterparty;
                    exist.contract_sum = contract.contract_sum || 0;
                    exist.curr_year_sum = contract.curr_year_sum || 0;
                    exist.exec_curr_year = contract.exec_curr_year || 0;
                    exist.exec_past_periods = contract.exec_past_periods || 0;
                    exist.in_execution = contract.in_execution || 0;
                    exist.advance_sum = contract.advance_sum || 0;
                    exist.balance = contract.balance || 0;
                    exist.total_balance = contract.total_balance || 0;
                    exist.start_date = contract.start_date;
                    exist.end_date = contract.end_date;
                    exist.osnovanie = contract.osnovanie;
                } else {
                    // Контракт есть в исполнении нет  создаём запись с нулевыми выплатами
                    map.set(key, {
                        kfsr: null,
                        kcsr: contract.kcsr,
                        kvr: contract.kvr,
                        kosgu: contract.kosgu,
                        kvfo: contract.kvfo,
                        payment_plan_2026: 0,
                        payment_plan_2027: 0,
                        payment_plan_2028: 0,
                        doc_num: contract.doc_num,
                        doc_status: contract.doc_status,
                        doc_date: contract.doc_date,
                        total_sum: contract.total_sum || 0,
                        counterparty: contract.counterparty,
                        contract_sum: contract.contract_sum || 0,
                        curr_year_sum: contract.curr_year_sum || 0,
                        exec_curr_year: contract.exec_curr_year || 0,
                        exec_past_periods: contract.exec_past_periods || 0,
                        in_execution: contract.in_execution || 0,
                        advance_sum: contract.advance_sum || 0,
                        balance: contract.balance || 0,
                        total_balance: contract.total_balance || 0,
                        start_date: contract.start_date,
                        end_date: contract.end_date,
                        osnovanie: contract.osnovanie
                    });
                }
            });

            const report = Array.from(map.values());
            return res.status(200).json({ report });
        } catch (error) {
            console.error("Ошибка формирования отчёта:", error);
            return res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    // Экспорт отчёта в Excel
    static async exportReportToExcel(req, res) {
        try {
            const executions = await ExecutionModule.getAll();
            const contracts = await SummaryModule.getAll();
            const map = new Map();

            executions.forEach(exec => {
                const key = `${exec.kcsr || ''}|${exec.kvr || ''}|${exec.kosgu || ''}|${exec.kvfo || ''}`;
                map.set(key, {
                    "КФСР": exec.kfsr || '',
                    "КЦСР": exec.kcsr || '',
                    "КВР": exec.kvr || '',
                    "КОСГУ": exec.kosgu || '',
                    "КВФО": exec.kvfo || '',
                    "Выплаты - План 2026": exec.payment_plan_2026 || 0,
                    "Выплаты - План 2027": exec.payment_plan_2027 || 0,
                    "Выплаты - План 2028": exec.payment_plan_2028 || 0,
                    "Номер документа": '',
                    "Статус документа": '',
                    "Дата документа": '',
                    "Общая сумма": 0,
                    "Контрагент": '',
                    "Сумма контракта": 0,
                    "Сумма текущего года": 0,
                    "Исполнено в текущем году": 0,
                    "Исполнено в прошлых периодах": 0,
                    "В исполнении": 0,
                    "Сумма аванса": 0,
                    "Остаток": 0,
                    "Общий остаток": 0,
                    "Дата начала": '',
                    "Дата окончания": '',
                    "Основание": ''
                });
            });

            contracts.forEach(contract => {
                const key = `${contract.kcsr || ''}|${contract.kvr || ''}|${contract.kosgu || ''}|${contract.kvfo || ''}`;
                if (map.has(key)) {
                    const exist = map.get(key);
                    exist["Номер документа"] = contract.doc_num || '';
                    exist["Статус документа"] = contract.doc_status || '';
                    exist["Дата документа"] = contract.doc_date ? new Date(contract.doc_date).toLocaleDateString('ru-RU') : '';
                    exist["Общая сумма"] = contract.total_sum || 0;
                    exist["Контрагент"] = contract.counterparty || '';
                    exist["Сумма контракта"] = contract.contract_sum || 0;
                    exist["Сумма текущего года"] = contract.curr_year_sum || 0;
                    exist["Исполнено в текущем году"] = contract.exec_curr_year || 0;
                    exist["Исполнено в прошлых периодах"] = contract.exec_past_periods || 0;
                    exist["В исполнении"] = contract.in_execution || 0;
                    exist["Сумма аванса"] = contract.advance_sum || 0;
                    exist["Остаток"] = contract.balance || 0;
                    exist["Общий остаток"] = contract.total_balance || 0;
                    exist["Дата начала"] = contract.start_date ? new Date(contract.start_date).toLocaleDateString('ru-RU') : '';
                    exist["Дата окончания"] = contract.end_date ? new Date(contract.end_date).toLocaleDateString('ru-RU') : '';
                    exist["Основание"] = contract.osnovanie || '';
                } else {
                    map.set(key, {
                        "КФСР": '',
                        "КЦСР": contract.kcsr || '',
                        "КВР": contract.kvr || '',
                        "КОСГУ": contract.kosgu || '',
                        "КВФО": contract.kvfo || '',
                        "Выплаты - План 2026": 0,
                        "Выплаты - План 2027": 0,
                        "Выплаты - План 2028": 0,
                        "Номер документа": contract.doc_num || '',
                        "Статус документа": contract.doc_status || '',
                        "Дата документа": contract.doc_date ? new Date(contract.doc_date).toLocaleDateString('ru-RU') : '',
                        "Общая сумма": contract.total_sum || 0,
                        "Контрагент": contract.counterparty || '',
                        "Сумма контракта": contract.contract_sum || 0,
                        "Сумма текущего года": contract.curr_year_sum || 0,
                        "Исполнено в текущем году": contract.exec_curr_year || 0,
                        "Исполнено в прошлых периодах": contract.exec_past_periods || 0,
                        "В исполнении": contract.in_execution || 0,
                        "Сумма аванса": contract.advance_sum || 0,
                        "Остаток": contract.balance || 0,
                        "Общий остаток": contract.total_balance || 0,
                        "Дата начала": contract.start_date ? new Date(contract.start_date).toLocaleDateString('ru-RU') : '',
                        "Дата окончания": contract.end_date ? new Date(contract.end_date).toLocaleDateString('ru-RU') : '',
                        "Основание": contract.osnovanie || ''
                    });
                }
            });

            const report = Array.from(map.values());

            // Создаём Excel
            const XLSX = await import('xlsx');
            const ws = XLSX.utils.json_to_sheet(report);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Сводный отчет");
            const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

            res.setHeader('Content-Disposition', 'attachment; filename="execution_summary_report.xlsx"');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.send(buffer);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Ошибка при экспорте в Excel" });
        }
    }
}

export default BudgetReportController;