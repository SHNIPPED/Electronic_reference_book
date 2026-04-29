import express from 'express';
import SummaryController from '../controllers/SummaryController.js';

const router = express.Router();

router.get('/',SummaryController.getAll);
router.post('/create', SummaryController.create);
router.post('/edit/:id', SummaryController.update);
router.delete('/delete/:id', SummaryController.delete);

export default router;