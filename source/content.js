import optionsStorage from './options-storage.js';
import * as jQuery from "jquery";
import currency from 'currency.js';

const $ = jQuery.default;

console.log('🦭 Content script loaded for', chrome.runtime.getManifest().name);

async function init() {
	const options = await optionsStorage.getAll();

	let descriptionColumnIndex = $("#UnpaidDiv").find("th:contains(Description)").index();
	let totalAmountColumnIndex = $("#UnpaidDiv").find("th:contains(Total Amount)").index();
	let paymentInputs = $("#UnpaidDiv").find("input[data-selenium-id^='txtPaymentAmount_']");

	paymentInputs.parent("td").parent("tr")
		.each(function (index) {
			let description = $(this).children().eq(descriptionColumnIndex).text();

			if (description === options.descriptionParking) {
				return;
			} else if (description === options.descriptionRent) {
				let rentPayment = currency($(this).children().eq(totalAmountColumnIndex).text()).multiply(options.rateRent).toString();
				$(this).find("input[data-selenium-id^='txtPaymentAmount_']").attr("value", rentPayment);
				$(this).find("input[data-selenium-id^='txtPaymentAmount_']").focus()
				$(this).find("input[data-selenium-id^='txtPaymentAmount_']").focusout()

			} else {
				let otherPayment = currency($(this).children().eq(totalAmountColumnIndex).text()).multiply(options.rateOther).toString();
				$(this).find("input[data-selenium-id^='txtPaymentAmount_']").attr("value", otherPayment);
				$(this).find("input[data-selenium-id^='txtPaymentAmount_']").focus();
				$(this).find("input[data-selenium-id^='txtPaymentAmount_']").focusout()
			};
		});
}

init();
