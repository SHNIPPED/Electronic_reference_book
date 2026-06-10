import SummaryModule from "../models/SummaryModels.js";

class ContractAdditionalController {
  // Получить служебку по contract_id
  static async getByContractId(req, res) {
    try {
      const { contractId } = req.params;
      const result = await SummaryModule.getContractAdditional(contractId);
      if (result) {
        return res.status(200).json(result);
      } else {
        return res.status(404).json({ message: 'Служебка не найдена' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  // Создать служебку
  static async create(req, res) {
    try {
      const { contract_id, approvals_2026, obligations_2027, approvals_2027 } = req.body;
      const result = await SummaryModule.createContractAdditional({
        contract_id,
        approvals_2026,
        obligations_2027,
        approvals_2027
      });
      return res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Ошибка создания служебки' });
    }
  }

  // Обновить служебку (по id записи)
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { approvals_2026, obligations_2027, approvals_2027 } = req.body;
      const result = await SummaryModule.updateContractAdditional(id, {
        approvals_2026,
        obligations_2027,
        approvals_2027
      });
      if (result.affectedRows > 0) {
        return res.status(200).json({ message: 'Служебка обновлена' });
      } else {
        return res.status(404).json({ message: 'Служебка не найдена' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Ошибка обновления служебки' });
    }
  }

  // Удалить служебку по contract_id (или по id)
  static async deleteByContractId(req, res) {
    try {
      const { contractId } = req.params;
      const result = await SummaryModule.deleteContractAdditionalByContractId(contractId);
      if (result.affectedRows > 0) {
        return res.status(200).json({ message: 'Служебка удалена' });
      } else {
        return res.status(404).json({ message: 'Служебка не найдена' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Ошибка удаления служебки' });
    }
  }
}

export default ContractAdditionalController;