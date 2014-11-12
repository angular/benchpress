
function Utils() {}
Utils.prototype.parseSearch = function (search) {
  var parsed = {};
  var tuples = search.replace(/^\?/, '').split('&');
  tuples.forEach(function(pair) {
    var keyVal = pair.split('=');
    parsed[keyVal[0]] = keyVal[1];
  });
  return parsed;
};

module.exports = Utils;
