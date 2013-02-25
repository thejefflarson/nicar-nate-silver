 var data = {"CO":[52.083333333333336,50.526315789473685,53.06122448979592,50.56179775280899,50.526315789473685,50,51.086956521739125,52.083333333333336,48.45360824742268,51.02040816326531],"FL":[50,49.47368421052632,50,50,51.08695652173913,50.5050505050505,48.97959183673469,49.47368421052632,51.06382978723404],"IA":[49.48453608247423,51.02040816326531,50.526315789473685,52.80898876404494,51.11111111111111,52.12765957446809,49.48453608247423,49.438202247191015,53.191489361702125,51.041666666666664],"NC":[47.916666666666664,50,48.95833333333333,50,47.368421052631575,50,51.64835164835166,46.93877551020408,45.91836734693878],"NH":[51.02040816326531,52.083333333333336,50,52.08333333333333,51.02040816326531,52.222222222222214,50,50.505050505050505,53.191489361702125,51.041666666666664],"NV":[52.04081632653062,52.12765957446809,53.191489361702125,52.083333333333336,53.2608695652174,50.5050505050505,51.546391752577314,52.04081632653062,51.02040816326531,51.041666666666664],"OH":[51.51515151515152,53.68421052631579,52.083333333333336,50.51546391752577,52.68817204301075,50,50.505050505050505,52.52525252525253,51.06382978723404,51.08695652173913],"VA":[51.06382978723405,54.166666666666664,51.61290322580645,48.97959183673469,50.52631578947368,52.04081632653062,50.51546391752577,51.06382978723405,51.61290322580645,50.51546391752577],"WI":[53.535353535353536,50.51546391752577,52.083333333333336,51.515151515151516,53.333333333333336,53.608247422680414,54.736842105263165,51.041666666666664,50,51.578947368421055]};
  // graphs!
var plot = function(id, dfunc, maxer){
  var maxy = Math.max();
  var min  = Math.min();
  var max  = Math.max();
  // I'm so sorry
  Object.keys(data).forEach(function(it){
    var arr = data[it];
    var dfer = dfunc(stats.mean(arr), stats.sd(arr));
    var win = stats.sd(arr) * 3;
    min  = Math.min(stats.mean(arr) - win, min);
    max  = Math.max(stats.mean(arr) + win, max);
    maxy = Math.max(maxer(dfer, arr), maxy); // for cdf
  });

  Object.keys(data)
        .sort(function(a, b) {
          return stats.mean(data[a]) > stats.mean(data[b]) ? 1 : -1;
        }).forEach(function(it){
    var div = document.createElement('div');
    document.getElementById(id).appendChild(div);
    var func = dfunc(stats.mean(data[it]), stats.sd(data[it]));
    P(div, func)
      .window(min, max, (max - min) / 90, maxy)
      .plot()
      .points(data[it]);
    var span = document.createElement(span);
    span.innerHTML = it;
    div.appendChild(span);
  });
};
plot('pdf', pdf.pdfFor, function(fn, arr) { return fn(stats.mean(arr)); });
plot('cdf', cdf.cdfFor, function(fn, arr) { return fn(Math.max.apply(Math, arr)); });

var votes = {
  "FL" : 29,
  "NH" : 4,
  "VA" : 13,
  "OH" : 18,
  "CO" : 9,
  "WI" : 10,
  "IA" : 6,
  "NC" : 15,
  "NV" : 6
};


var State = function(div, key){
  this.name  = key;
  this.cdf   = cdf.cdfFor(stats.mean(data[key]), stats.sd(data[key]));
  this.thres = this.cdf(50);
  this.plot  = document.createElement('div');
  var name = document.createElement('span');
  name.setAttribute('class', 'name');
  name.innerHTML = key;
  this.plot.appendChild(name);
  this.votes = votes[key];
  div.appendChild(this.plot);
};

State.prototype.run = function(){
  var rand = Math.random();
  var div = document.createElement('div');
  if(rand > this.thres) {
    div.setAttribute('class', 'win o');
    this.plot.appendChild(div);
    return this.votes;
  } else {
    div.setAttribute('class', 'win r');
    this.plot.appendChild(div);
    return 0;
  }
};


var experiment = function(id){
  var div    = document.getElementById(id);
  var states = Object.keys(data)
        .sort(function(a, b) {
          return stats.mean(data[a]) > stats.mean(data[b]) ? 1 : -1;
        }).map(function(state){
          return new State(div, state);
        });

  var reducer = function(memo, state) {
    return memo + state.run();
  };

  var runs = [];
  for(var i = 0; i < 1000; i++)
    runs = runs.concat(states.reduce(reducer, 0));
};
experiment('carlos');