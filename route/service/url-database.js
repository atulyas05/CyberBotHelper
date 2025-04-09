const csv = require('csv-parser')
const fs = require('fs')
const results = [];

const urlDatasets = new Map();

async function processURLDatasets() {

	fs.createReadStream('./malicious_phish.csv')
	  .pipe(csv())
	  .on('data', (data) => results.push(data))
	  .on('end', () => {
		for (var i = 0; i < results.length; i++) {

			var urlType = results[i].type;
			var hostname = results[i].url;

			hostname = hostname.replace(/["']/g, '');

			if (isValidHttpUrl(results[i].url)) {
				var processURL = new URL(hostname);
				hostname = processURL.hostname;
			} else {
				hostname = hostname.substring(0, hostname.indexOf("/"));
			}

			if (urlType !== 'benign') {
				urlDatasets.set(hostname, urlType);
			}

		}
		console.log("Ready with record count: ", urlDatasets.size);
	  });
	}

	async function getURLDetails(hostname) {
		return urlDatasets.get(hostname) || "benign";
	}

	function isValidHttpUrl(string) {
	  let url;

	  try {
	    url = new URL(string);
	    return true;
	  } catch (_) {
	    return false;
	  }
	}


module.exports = {processURLDatasets, getURLDetails};
