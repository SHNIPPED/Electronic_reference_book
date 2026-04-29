import SummaryModule from "../models/SummaryModels.js";

class SummaryController{

    static async getAll(req, res) {
        try {
            const contracts = await SummaryModule.getAll();
            return res.status(200).json({ 
                contracts
            });
        }
        catch(error) {
            console.error('Ошибка при получении контрактов:', error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    static async create(req, res) {
        try {
            const summaryData = req.body;
            
            if (!summaryData.doc_num || !summaryData.doc_status || !summaryData.doc_date || 
                !summaryData.total_sum || !summaryData.counterparty || !summaryData.end_date) {
                return res.status(400).json({ 
                    message: 'Необходимо заполнить все обязательные поля: doc_num, doc_status, doc_date, total_sum, counterparty, end_date' 
                });
            }
    
            const result = await SummaryModule.create(summaryData);
    
            if (result && result.affectedRows > 0) {
                return res.status(200).json({
                    message: `Добавлен контракт: ${result.affectedRows}`,
                    id: result.insertId 
                });
            } 
            else {
                return res.status(404).json({ message: 'Контракт не добавлен' });
            }
        }
        catch(error) {
            console.error('Ошибка при добавлении контракта:', error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const summaryData = req.body;

            if (isNaN(id)) {
                return res.status(400).json({ message: 'Некорректный ID' });
            }

            if (!summaryData.doc_num || !summaryData.doc_status || !summaryData.doc_date || 
                !summaryData.total_sum || !summaryData.counterparty || !summaryData.end_date) {
                return res.status(400).json({ 
                    message: 'Необходимо заполнить все обязательные поля' 
                });
            }

            const result = await SummaryModule.update(id, summaryData);

            if (result && result.affectedRows > 0) {
                return res.status(200).json({ 
                    message: `Изменен контракт: ${result.affectedRows}`
                });
            } 
            else {
                return res.status(404).json({ message: 'Контракт не изменен' });
            }
        }
        catch(error) {
            console.error('Ошибка при изменении контракта:', error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }


    static async delete(req, res) {
        try {
            const { id } = req.params;

            if (isNaN(id)) {
                return res.status(400).json({ message: 'Некорректный ID' });
            }
      
            const result = await SummaryModule.delete(id);
      
            if (result && result.affectedRows > 0) {
                return res.status(200).json({ 
                    message: `Удалено контрактов: ${result.affectedRows}`
                });
            } 
            else {
                return res.status(404).json({ message: 'Контракт не найден' });
            }
        }
        catch(error) {
            console.error('Ошибка при удалении контракта:', error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }


}

export default SummaryController;