import OptionsSync from 'webext-options-sync';

export default new OptionsSync({
	defaults: {
		enableParking: true,
		descriptionParking: "Parking Income",
		feeParking: "185.00",
		descriptionRent: "Rent",
		rateRent: 0.3333,
		rateOther: 0.3333
	},
	migrations: [
		OptionsSync.migrations.removeUnused,
	],
	logging: true,
});
