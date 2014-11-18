function Logger() {

}

Logger.prototype.write = function(ln) {
  console.log(ln);
};

module.exports = Logger;
