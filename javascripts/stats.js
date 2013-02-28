(function(){
  var stats = this.stats = {};

  stats.variance = function(arr){
    var mean = stats.mean(arr);
    return arr.reduce(function(memo, it){
      var diff = mean - it;
      return memo + Math.pow(diff, 2);
    }, 0) / arr.length;
  };

  stats.sd = function(arr){
    return Math.sqrt(stats.variance(arr));
  };

  stats.sum = function(arr){
    return arr.reduce(function(memo, it) {
      return memo + it;
    }, 0);
  };

  stats.mean = function(arr){
    return stats.sum(arr) / arr.length;
  };
}).call(this);