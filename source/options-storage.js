import OptionsSync from 'webext-options-sync';

export default new OptionsSync({
	defaults: {
		rateRent: 0.3333,
		rateOther: 0.3333,
		feeParking: 185
	},
	migrations: [
		OptionsSync.migrations.removeUnused,
	],
	logging: true,
});
