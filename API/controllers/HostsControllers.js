import HostsService from "../services/HostsService.js";

class HostsController{


	async getAll(req, res) {
		try {
		   const Hosts = await HostsService.getAll();
		   res.json(Hosts);
	   } catch (e) {
		   res.status(500).json(e);
	   }
   }
}
export default new HostsController()