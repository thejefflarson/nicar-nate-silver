(function(){
  var pdf = this.pdf = {};
  var slicer = [].slice;
  pdf.pdf = function(mean, sd, x){
    var exp = -1 * Math.pow((x - mean) / (2 * sd), 2);
    return Math.pow(Math.E, exp) / (sd * Math.sqrt(2 * Math.PI));
  };

  pdf.pdfFor = function(mean, sd){
    return function(){
      return pdf.pdf.apply(this, [mean, sd].concat(slicer.call(arguments)));
    };
  };
}).call(this);