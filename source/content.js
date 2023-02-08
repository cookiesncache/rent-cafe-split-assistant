import optionsStorage from './options-storage.js';
import currency from 'currency.js';
import { parse } from 'csv-parse';
import "./import-jquery";

console.log('🦭 Content script loaded for', chrome.runtime.getManifest().name);

async function init() {
	const options = await optionsStorage.getAll();

	// Initialize parking fees.
	const parkingFees = [];
	const parser = parse({
		delimiter: ','
	});
	parser.on('readable', function () {
		let parkingFee;
		while ((record - parser.read()) !== null) {
			parkingFees.push(parkingFee);
		}
	});
	// Catch any error
	parser.on('error', function (err) {
		console.error(err.message);
	});
	// Write parking fees.
	parser.write(options.feeParking);
	parser.end();

	if (options.enableParking) {
		// Set input of all parking inputs to 0.
		// For each fee in parkingFees, filter() selection to one input of 0 and set input to fee.
		// Throw a pop up error if parkingFee not found. Maybe already paid.
	}

	let descriptionColumnIndex = $("#UnpaidDiv").find("th:contains(Description)").index();
	let totalAmountColumnIndex = $("#UnpaidDiv").find("th:contains(Total Amount)").index();
	let paymentInputs = $("#UnpaidDiv").find("input[data-selenium-id^='txtPaymentAmount_']");

	paymentInputs.parent("td").parent("tr")
		.each(function (index) {
			let description = $(this).children().eq(descriptionColumnIndex).text();
			let totalAmount = currency($(this).children().eq(totalAmountColumnIndex).text());

			if (description === options.descriptionParking) {
				return;
			} else if (description === options.descriptionRent) {
				let rentPayment = totalAmount.multiply(options.rateRent).toString();
				$(this).find("input[data-selenium-id^='txtPaymentAmount_']")
					.attr("value", rentPayment)
					.trigger("focus")
					.trigger("focusout");
			} else {
				let otherPayment = totalAmount.multiply(options.rateOther).toString();
				$(this).find("input[data-selenium-id^='txtPaymentAmount_']")
					.attr("value", otherPayment)
					.trigger("focus")
					.trigger("focusout");
			};
		});
}

init();
