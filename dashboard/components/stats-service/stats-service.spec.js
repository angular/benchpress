describe('bpdStatsService', function() {
  var stats, escapeDollarSigns;

  beforeEach(function() {
    module('bpdStatsService');
    inject(function(_escapeDollarSigns_, _stats_) {
      stats = _stats_;
      escapeDollarSigns = _escapeDollarSigns_;
    });
  });

  it('should start with an empty object', function() {
    expect(stats.current).toEqual({});
  });


  describe('escapeDollarSigns', function() {
    it('should rename keys', function() {
      expect(escapeDollarSigns({'$apply':{}})).toEqual({' $apply':{}});
    });
  });
});
