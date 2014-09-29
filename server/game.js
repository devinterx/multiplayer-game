
var _ = require('underscore');

var Classy = require('../shared/libs/classy.js');
var Timestamp = require('../shared/Timestamp.js');

var NetworkCircle = require('./objects/NetworkCircle.js');



var Game = Classy.extend({
  __init__: function() {
    _.bindAll(this, 'update', 'start', 'stop', 'socketDisconnect');

    this.networkCircles = {};

    this.updateFrequencyMs = 1000 / 1;
    this.latency = 300;
  },

  socketConnect: function(socket) {
    this.networkCircles[socket.id] = new NetworkCircle(this, socket);

    socket.on('disconnect', _.bind(function() { this.socketDisconnect(socket); }, this));

    if (_.keys(this.networkCircles).length === 1) {
      this.start();
    }
  },

  socketDisconnect: function(socket) {
    delete this.networkCircles[socket.id];
    if (_.isEmpty(this.networkCircles)) {
      this.stop();
    }
  },


  start: function() {
    this.intervalId = setInterval(this.update, this.updateFrequencyMs);
  },

  stop: function() {
    clearInterval(this.intervalId);
  },


  update: function() {
    var timestamp = Timestamp.create(this.previousTimestamp);

    _.each(this.networkCircles, function(networkCircle, id) {

      networkCircle.update(timestamp);
      setTimeout(function() {
        networkCircle.socket.emit('state', {
          state: networkCircle.getState(),
          timestamp: timestamp
        });
      }, this.latency);

    }, this);

    this.previousTimestamp = timestamp;
  }
});






module.exports = new Game();