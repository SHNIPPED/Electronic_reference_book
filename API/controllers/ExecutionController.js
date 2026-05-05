import ExecutionModule from "../models/ExecutionModules.js";

class ExecutionController {

    static async getAll(req, res) {
        try {
            const executions = await ExecutionModule.getAll();
            return res.status(200).json({ 
                executions
            });
        }
        catch(error) {
            console.error('Ошибка при получении данных исполнения:', error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    static async create(req, res) {
        try {
            const executionData = req.body;
            
            // Проверка обязательных полей (на основе вашей таблицы)
            if (!executionData.budget || !executionData.document_status || !executionData.document_number || 
                !executionData.document_date || !executionData.type || !executionData.institution || 
                !executionData.founder || !executionData.structure) {
                return res.status(400).json({ 
                    message: 'Необходимо заполнить все обязательные поля: budget, document_status, document_number, document_date, type, institution, founder, structure' 
                });
            }
    
            const result = await ExecutionModule.create(executionData);
    
            if (result && result.affectedRows > 0) {
                return res.status(200).json({
                    message: `Добавлена запись исполнения: ${result.affectedRows}`,
                    id: result.insertId 
                });
            } 
            else {
                return res.status(404).json({ message: 'Запись исполнения не добавлена' });
            }
        }
        catch(error) {
            console.error('Ошибка при добавлении записи исполнения:', error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const executionData = req.body;

            if (isNaN(id)) {
                return res.status(400).json({ message: 'Некорректный ID' });
            }

            // Проверка обязательных полей
            if (!executionData.budget || !executionData.document_status || !executionData.document_number || 
                !executionData.document_date || !executionData.type || !executionData.institution || 
                !executionData.founder || !executionData.structure) {
                return res.status(400).json({ 
                    message: 'Необходимо заполнить все обязательные поля: budget, document_status, document_number, document_date, type, institution, founder, structure' 
                });
            }

            const result = await ExecutionModule.update(id, executionData);

            if (result && result.affectedRows > 0) {
                return res.status(200).json({ 
                    message: `Изменена запись исполнения: ${result.affectedRows}`
                });
            } 
            else {
                return res.status(404).json({ message: 'Запись исполнения не изменена' });
            }
        }
        catch(error) {
            console.error('Ошибка при изменении записи исполнения:', error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;

            if (isNaN(id)) {
                return res.status(400).json({ message: 'Некорректный ID' });
            }
      
            const result = await ExecutionModule.delete(id);
      
            if (result && result.affectedRows > 0) {
                return res.status(200).json({ 
                    message: `Удалено записей исполнения: ${result.affectedRows}`
                });
            } 
            else {
                return res.status(404).json({ message: 'Запись исполнения не найдена' });
            }
        }
        catch(error) {
            console.error('Ошибка при удалении записи исполнения:', error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }
}

export default ExecutionController;