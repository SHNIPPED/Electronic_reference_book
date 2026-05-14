import express from 'express';
import BudgetReportController from '../controllers/BudgetReportController.js';

const router = express.Router();

router.get('/hierarchical', BudgetReportController.getHierarchicalReport);
router.get('/export-excel', BudgetReportController.exportReportToExcel);

export default router;