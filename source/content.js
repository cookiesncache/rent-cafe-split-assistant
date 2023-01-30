import optionsStorage from './options-storage.js';

console.log('🟢 Content script loaded for', chrome.runtime.getManifest().name);

async function init() {
	const options = await optionsStorage.getAll();
	
	console.log(`Rent Rate: ${options.rateRent}, Other Rate: ${options.rateOther}, Parking Fee: ${options.feeParking}`);
}

init();
