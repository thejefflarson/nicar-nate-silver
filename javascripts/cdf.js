(function(){
  var cdf = this.cdf = {};
  var slicer = [].slice;

  var erf = function(x) {
    var a      = 0.140012;
    var x2     = x * x;
    var top    = (4 / Math.PI) + a * x2;
    var bottom = 1 + a * x2;
    return Math.sqrt(1 - Math.exp(-x2 * top / bottom)) * (x > 0 ? 1 : -1);
  };

  cdf.cdf = function(mean, sd, x){
    var erfv = erf((x - mean) / Math.sqrt(2 * sd * sd));
    var res = 0.5 * (1 + erfv);
    return res;
  };

  cdf.cdfFor = function(mean, sd){
    return function(){
      return cdf.cdf.apply(this, [mean, sd].concat(slicer.call(arguments)));
    };
  };
}).call(this);