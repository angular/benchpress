function Statistics() {
  //Taken from z-table where confidence is 95%
  this.criticalValue = 1.96
}

Statistics.prototype.getMean = function (sample) {
  var total = 0;
  sample.forEach(function(x) { total += x; });
  return total / sample.length;
};

Statistics.prototype.calculateConfidenceInterval = function(standardDeviation, sampleSize) {
  var standardError = standardDeviation / Math.sqrt(sampleSize);
  return this.criticalValue * standardError;
};

Statistics.prototype.calculateRelativeMarginOfError = function(marginOfError, mean) {
  /*
   * Converts absolute margin of error to a relative margin of error by
   * converting it to a percentage of the mean.
   */
  return (marginOfError / mean);
};

Statistics.prototype.calculateCoefficientOfVariation = function(standardDeviation, mean) {
  return standardDeviation / mean;
};

Statistics.prototype.calculateStandardDeviation = function(sample, mean) {
  var deviation = 0;
  sample.forEach(function(x) {
    deviation += Math.pow(x - mean, 2);
  });
  deviation = deviation / (sample.length -1);
  deviation = Math.sqrt(deviation);
  return deviation;
};

module.exports = Statistics;
