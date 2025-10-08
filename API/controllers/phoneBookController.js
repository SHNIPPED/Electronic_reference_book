import PhoneBookModel from '../models/phoneBookModule.js';

class PhoneBookController{

    static async getAll(req,res){
        try{
            const phoneBooks = await PhoneBookModel.getAll();
            return res.status(200).json({ 
                phoneBooks
            });
        }
        catch(error) {
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    static async create(req, res) {
        try {
            const { fcs, post, phone_number, email, addres, deport } = req.body;
          
            if (!fcs || !post || !deport) {
                return res.status(400).json({ message: 'Необходимо заполнить все обязательные поля' });
            }
    
            const result = await PhoneBookModel.create({ fcs, post, phone_number, email, addres, deport });
    
            if (result.affectedRows > 0) {
                return res.status(200).json({ 
                message: `Добавлена запись: ${result.affectedRows}`,
                id: result.insertId });
            } 
            else {
                return res.status(404).json({ message: 'Запись не добавлена' });
            }
        } 
        catch (error) {
            console.error('Ошибка при добавлении записи:', error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const { fcs, post, phone_number, email, addres, deport } = req.body;
    
            if (!fcs || !post || !deport || !id) {
                return res.status(400).json({ message: 'Необходимо заполнить все обязательные поля' });
            }
    
            const result = await PhoneBookModel.update(id, { fcs, post, phone_number, email, addres, deport });

    
            if (result && result.affectedRows > 0) {
                return res.status(200).json({ 
                    message: `Изменена запись: ${result.affectedRows}`
                });
            } else {
                return res.status(404).json({ message: `Запись не изменена`});
            }
        } catch (error) {
            console.error('Ошибка при изменении записи:', error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    static async delete(req,res){
        try{
            const { id } = req.params;

            if (isNaN(id)) {
                return res.status(400).json({ message: 'Некорректный ID' });
            }
      
            const result = await PhoneBookModel.delete(id);
      
            if (result.affectedRows > 0) {
                return res.status(200).json({ 
                message: `Удалено записей: ${result.affectedRows}`
                });
            } 
            else {
                return res.status(404).json({ message: 'Запись не найдена' });
            }
        }
        catch(error){
            console.error('Ошибка при удалении записи:', error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }
}

export default PhoneBookController;