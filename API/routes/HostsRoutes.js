import {express}  from 'express'
import HostsController from '../controllers/HostsControllers.js'

const route = express.Router();

route.get('/Hosts', HostsController.getAll);

export default route;