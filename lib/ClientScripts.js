function ClientScripts () {
  this._scripts = [];
}

ClientScripts.prototype.all = function() {
  return this._scripts;
}

ClientScripts.prototype.shiftOne = function() {
  return this._scripts.shift();
};

ClientScripts.prototype.add = function(script) {
  this._scripts.push(script);
};

ClientScripts.prototype.addMany = function(scripts) {
  this._scripts.push.apply(this._scripts, scripts);
}

module.exports = ClientScripts;
