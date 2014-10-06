define([
	'underscore',
	'events',

	'dat.gui'
], function(
	_,
	Events,

	dat
) {


	var Settings = {
		values: {
			restart: function () {
				Settings.trigger('restart');
			},
			clientfps: 60,
			latency: 100,
			serverfps: 10,
			clientPrediction: false,
			reconciliation: false
		},

		init: function() {
			_.bindAll(Settings, 'valuesChanged');

			var gui = Settings.gui = new dat.GUI();

			gui.add(Settings.values, 'restart');
			gui.add(Settings.values, 'clientfps').min(1).max(60).onFinishChange(Settings.valuesChanged);
			gui.add(Settings.values, 'latency').min(0).max(1000).step(50).onFinishChange(Settings.valuesChanged);
			gui.add(Settings.values, 'serverfps').min(1).max(60).step(5).onFinishChange(Settings.valuesChanged);
			gui.add(Settings.values, 'clientPrediction').name('client prediction');
			gui.add(Settings.values, 'reconciliation').name('reconciliation').onChange(Settings.valuesChanged);

			gui.close();
		},

		valuesChanged: function(value) {
			Settings.trigger('values.updated');
		}
	};


	_.extend(Settings, Events);

	return Settings;
});