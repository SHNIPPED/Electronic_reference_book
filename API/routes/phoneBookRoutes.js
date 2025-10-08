import express from 'express';
import PhoneBookController from '../controllers/phoneBookController.js';

const router = express.Router();

router.get('/',PhoneBookController.getAll);
router.post('/create', PhoneBookController.create);
router.post('/edit/:id', PhoneBookController.update);
router.delete('/delete/:id', PhoneBookController.delete);

export default router;