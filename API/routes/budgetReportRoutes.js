import express from 'express';
import BudgetReportController from '../controllers/BudgetReportController.js';

const router = express.Router();

router.get('/hierarchical', BudgetReportController.getHierarchicalReport);
router.get('/export-excel', BudgetReportController.exportReportToExcel);
router.post('/update-exec-date/:id', BudgetReportController.updateExecDate);
router.post('/update-contract-field/:id', BudgetReportController.updateContractField);

export default router;