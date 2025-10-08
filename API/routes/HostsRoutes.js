import express  from 'express'
import HostsController from '../controllers/HostsControllers.js'

const router = express.Router();

router.get('/',HostsController.getAll);
router.post('/create', HostsController.create);
router.post('/edit/:id', HostsController.update);
router.delete('/delete/:id', HostsController.delete);

export default router;