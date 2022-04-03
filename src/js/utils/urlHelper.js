export function getHostname(urlString){
	try {
		let hostname = new URL(urlString).hostname
		return hostname;
	}
	catch (err) {
		// Thank you for this regex! @cimnine: https://regexr.com/3e8n2 
		let domainNameRegex = /^((?:([a-z0-9]\.|[a-z0-9][a-z0-9\-]{0,61}[a-z0-9])\.)+)([a-z0-9]{2,63}|(?:[a-z0-9][a-z0-9\-]{0,61}[a-z0-9]))\.?$/gim;
		
		if (!domainNameRegex.test(urlString)) {
			return "";
		}

		return urlString;
	}
}