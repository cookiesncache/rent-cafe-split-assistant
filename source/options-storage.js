import OptionsSync from 'webext-options-sync';

export default new OptionsSync({
	defaults: {
		colorRed: 0,
		colorGreen: 0,
		colorBlue: 0,
		text: 'Set a text!',
		rateRent: 0.5000
	},
	migrations: [
		OptionsSync.migrations.removeUnused,
	],
	logging: true,
});
