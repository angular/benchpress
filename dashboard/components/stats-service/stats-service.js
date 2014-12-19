(function() {

angular.module('bpdStatsService', []).
  service('stats', ['escapeDollarSigns', StatsService]).
  factory('escapeDollarSigns', function() {
    return function(stats) {
      for (var key in stats) {
        if (stats.hasOwnProperty(key) && key.indexOf('$') === 0) {
          //Add a space at the front so ngRepeat won't skip this property
          stats[key.replace('$', ' $')] = stats[key];
          delete stats[key];
        }
      }
      return stats;
    }

  });

function StatsService (escapeDollarSigns) {
  this._stats = {};
  this._escapeDollarSigns = escapeDollarSigns;
}

//TODO: support streaming stats
StatsService.prototype = {
  get current() {
    return this._stats;
  },
  set current(value) {
    this._stats = this._escapeDollarSigns(value);
  }
};

}());
