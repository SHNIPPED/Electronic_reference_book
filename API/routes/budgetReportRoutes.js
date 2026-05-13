import express from 'express';
import BudgetReportController from '../controllers/BudgetReportController.js';

const router = express.Router();

router.get('/consolidated', BudgetReportController.getCombinedReport);

export default router;