import optionsStorage from './options-storage.js';
import currency from 'currency.js';
import { parse } from 'csv-parse';
import "./import-jquery";

console.log('🦭 Content script loaded for', chrome.runtime.getManifest().name);

async function init() {
	const options = await optionsStorage.getAll();

	let descriptionColumnIndex = $("#UnpaidDiv").find("th:contains(Description)").index();
	let totalAmountColumnIndex = $("#UnpaidDiv").find("th:contains(Total Amount)").index();
	let paymentInputs = $("#UnpaidDiv").find("input[data-selenium-id^='txtPaymentAmount_']");

	// Initialize parking fees.
	const parkingFees = [];
	const parser = parse({
		delimiter: ','
	});
	parser.on('readable', function () {
		let parkingFee;
		while ((record = parser.read()) !== null) {
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
		$("#UnpaidDiv")
		.find(`"td:contains(${options.descriptionParking})"`)
		.parent("tr")
		.find("input[data-selenium-id^='txtPaymentAmount_']")
		.attr("value", "0.00");

		for (let fee in parkingFees) {
			$("#UnpaidDiv")
			.find(`"td:contains(${options.descriptionParking})"`)
			.parent("tr")
			.filter(function() {
				return this.children().eq(totalAmountColumnIndex).text().includes(fee);
			})
			.filter(function() {
				return this.find("input[data-selenium-id^='txtPaymentAmount_']").attr() === "0.00";
			})
			.find("input[data-selenium-id^='txtPaymentAmount_']")
			.attr(fee);
		}
	}

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
