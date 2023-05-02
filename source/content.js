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
		while ((parkingFee = parser.read()) !== null) {
			parkingFees.push(parkingFee.toString());
		}
	});
	// Catch any error
	parser.on('error', function (err) {
		console.error(err.message);
	});
	parser.on('end', function () {
		paymentInputs.parent("td").parent("tr")
			.each(function (index) {
				let description = $(this).children().eq(descriptionColumnIndex).text();
				let totalAmount = currency($(this).children().eq(totalAmountColumnIndex).text());

				if (description.includes(options.descriptionParking)) {
					return;
				} else if (description.includes(options.descriptionRent)) {
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

		if (options.enableParking) {
			$("#UnpaidDiv")
				.find("td:contains(" + options.descriptionParking + ")")
				.parent("tr")
				.find("input[data-selenium-id^='txtPaymentAmount_']")
				.attr("value", "0.00");

			parkingFees.forEach((parkingFee) => {
				$("#UnpaidDiv")
					.find("td:contains(" + options.descriptionParking + ")")
					.parent("tr")
					.filter(function () {
						return $(this).find("input[data-selenium-id^='txtPaymentAmount_']").attr("value") === "0.00";
					})
					.filter(function () {
						return $(this).children().eq(totalAmountColumnIndex).text().includes(parkingFee);
					})
					.find("input[data-selenium-id^='txtPaymentAmount_']")
					.attr("value", parkingFee);
			});
		}
	});
	// Write parking fees.
	parser.write(options.feeParking);
	parser.end();
}

init();
