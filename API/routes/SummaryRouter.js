import express from 'express';
import SummaryController from '../controllers/SummaryController.js';
import ContractAdditionalController from '../controllers/contractAdditionalController.js';

const router = express.Router();

router.get('/',SummaryController.getAll);
router.post('/create', SummaryController.create);
router.post('/edit/:id', SummaryController.update);
router.delete('/delete/:id', SummaryController.delete);

router.get('/contract-additional/contract/:contractId', ContractAdditionalController.getByContractId);
router.post('/contract-additional', ContractAdditionalController.create);
router.put('/contract-additional/:id', ContractAdditionalController.update);
router.delete('/contract-additional/contract/:contractId', ContractAdditionalController.deleteByContractId);

export default router;