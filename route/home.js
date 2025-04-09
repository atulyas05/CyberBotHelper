const express = require ('express');
const router = express.Router();
const urlDatabase = require('./service/url-database');

router.get('/', async (req, res ) => {
    return res.status(200).json({message: "I am cyber bot service, up and running ...."});
});

router.get('/get-host-status/:hostname', async (req, res ) => {

	var hostname = req.params.hostname;
	if (hostname && hostname.length > 0) {
		var type = await urlDatabase.getURLDetails(hostname);
		return res.status(200).json({message: "Hostname found", type});
	} else {
		return res.status(404).json({message: "Hostname not found in the request"});
	}

});

module.exports = router;
