// eslint-disable-next-line import/no-unassigned-import
import './options-storage.js';

const paymentPage = "https://*.securecafe.com/residentservices/*/paymentonetime.aspx";

chrome.browserAction.onClicked.addListener(function (tab) {
    if (tab.url.match(paymentPage)) {
        chrome.tabs.executeScript(tab.id, {
            "file": "content.js"
        }, function () {
            console.log('🦭 Content script executed for', chrome.runtime.getManifest().name);
        });
    }
});
