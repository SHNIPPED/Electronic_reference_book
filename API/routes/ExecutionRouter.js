import express from 'express';
import ExecutionCoontroller  from '../controllers/ExecutionController.js';

const router = express.Router();

router.get('/',ExecutionCoontroller.getAll);
router.post('/create', ExecutionCoontroller.create);
router.post('/edit/:id', ExecutionCoontroller.update);
router.delete('/delete/:id', ExecutionCoontroller.delete);

export default router;