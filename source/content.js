import optionsStorage from './options-storage.js';
import currency from 'currency.js';
import "./import-jquery";

console.log('🦭 Content script loaded for', chrome.runtime.getManifest().name);

async function init() {
	const options = await optionsStorage.getAll();

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
					.focus()
					.focusout();
			} else {
				let otherPayment = totalAmount.multiply(options.rateOther).toString();
				$(this).find("input[data-selenium-id^='txtPaymentAmount_']")
					.attr("value", otherPayment)
					.focus()
					.focusout();
			};
		});
}

init();
