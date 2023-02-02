import optionsStorage from './options-storage.js';
import * as jQuery from "jquery";

const $ = jQuery.default;

console.log('🦭 Content script loaded for', chrome.runtime.getManifest().name);

async function init() {
	const options = await optionsStorage.getAll();

	console.log($( "#UnpaidDiv" ).index());
}

init();
