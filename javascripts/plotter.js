(function(){


  var Bounds = function(){
    this.maxx = Math.max();
    this.maxy = Math.max();
    this.minx = Math.min();
    this.miny = Math.min();
  };

  Bounds.prototype.extend = function(pt) {
    this.maxx = Math.max(pt[0], this.maxx);
    this.maxy = Math.max(pt[1], this.maxy);
    this.minx = Math.min(pt[0], this.minx);
    this.miny = Math.min(pt[1], this.miny);
  };

  Bounds.prototype.width = function(){
    return this.maxx - this.minx;
  };

  Bounds.prototype.height = function(){
    return this.maxy - this.miny;
  };

  var projector = function(arr, width, height, maxy){
    var bounds = new Bounds();
    for(var i = 0; i < arr.length; i++)
      bounds.extend(arr[i]);

    if(maxy) bounds.maxy = maxy; // hackers

    var scalex = width / bounds.width();
    var scaley = height / bounds.height();
    return function(x, y){
      return [
        (x - bounds.minx) * scalex + 10,
        height - (y - bounds.miny) * scaley + 10
      ];
    };
  };

  var Plotter = function(div, func) {
    var canvas = document.createElement("canvas");
    div.appendChild(canvas);
    this.width  = canvas.width  = div.offsetWidth;
    this.height = canvas.height = div.offsetHeight;
    this.width  -= 20;
    this.height -= 20;
    this.ctx    = canvas.getContext('2d');
    this.func   = func;
  };

  Plotter.prototype.window = function(min, max, step, maxy){
    var pts = this.pts = [];
    var update = function(x) { pts.push([x, this.func(x)]); }.bind(this);
    for(var x = min; x < max; x += step) update(x);
    var proj = this.proj = projector(pts, this.width, this.height, maxy);
    return this;
  };

  Plotter.prototype.points = function(pts){
    pts.forEach(function(it){
      this.ctx.save();
      if(it < 50)
        this.ctx.fillStyle = "#c40504";
      else
        this.ctx.fillStyle = "#1e4682";
      var pt = this.proj(it, this.func(it));
      this.ctx.beginPath();
      this.ctx.arc(pt[0], pt[1] - 1, 5, 0 , 2 * Math.PI, false);
      this.ctx.fill();
      this.ctx.restore();
    }.bind(this));
    return this;
  };

  Plotter.prototype.plot = function(min, max, step, maxy) {
    var proj = this.proj, pts = this.pts;

    var pt = proj(pts[0][0], pts[0][1]);
    this.ctx.moveTo(pt[0], pt[1]);
    this.ctx.save();
    this.ctx.lineJoin = 'round';
    this.ctx.beginPath();
    this.ctx.strokeStyle = "#c40504";
    this.ctx.lineWidth = 4;
    var flipped = false;
    for(var i = 0; i < pts.length; i++) {
      pt = proj(pts[i][0], pts[i][1]);
      console.log(pt)
      this.ctx.lineTo(pt[0], pt[1]);
      if(pts[i][0] > 50 && !flipped) {
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.strokeStyle = "#1e4682";
        flipped = true;
        this.ctx.moveTo(pt[0], pt[1]);
      }
    }
    this.ctx.stroke();
    this.ctx.restore();
    return this;
  };


  this.Plotter = Plotter;
  this.P = function(div, func){
    return new Plotter(div, func);
  };
}).call(this);