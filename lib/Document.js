var di = require('di');
var ClientScripts = require('./ClientScripts');
var Globals = require('./Globals');
var RunState = require('./RunState');
var Rx = require('rx');
var Utils = require('./Utils');

function Document(globals, runState, scripts, utils) {
  this._utils = utils;
  this._scripts = scripts;
  this._globals = globals;
  this._runState = runState;
  this.loadNextScript = this.loadNextScript.bind(this);
}

Document.prototype.setAutoRun = function(val) {
  this.autoRunner = val;
};

Document.prototype.addSampleRange = function() {
  this.sampleRange = this.container().querySelector('#sampleRange');
  if (this.sampleRange) {
    this.sampleRange.value = Math.max(this._runState.numSamples, 1);
    this.sampleRange.addEventListener('input', this.onSampleInputChanged.bind(this));
  }
};

Document.prototype.onSampleInputChanged = function (evt) {
  var value = evt.target.value;
  this._runState.numSamples = parseInt(value, 10);
};

Document.prototype.container = function() {
  if (!this._container) {
    this._container = document.querySelector('#benchmarkContainer');
  }
  return this._container;
};

Document.prototype.addInfo = function() {
  this.infoDiv = this.container().querySelector('div.info');
  if (this.infoDiv) {
    this.infoTemplate = _.template(this.container().querySelector('#infoTemplate').innerHTML);
  }
};

Document.prototype.loadNextScript = function() {
  var params = this._utils.parseSearch(this._globals._window.location.search);
  var config = this._scripts.shiftOne();
  if (!config) return;
  if (config.id) {
    if (params[config.id]) {
      config.src = params[config.id];
    }
    this.addScriptToUI(config);
  }
  var tag = document.createElement('script');
  tag.setAttribute('src', config.src);
  tag.onload = this.loadNextScript;
  document.body.appendChild(tag);
};

Document.prototype.openTab = function (id) {
  var divs = this._container.querySelectorAll('.tab-pane');
  for (var i=0;i<divs.length;i++) {
    divs[i].style.display = 'none';
  }

  this._container.querySelector('.nav-tabs li.active').classList.remove('active');
  this._container.querySelector(id).style.display = 'block';
  this._container.querySelector('[href="' + id + '"]').parentElement.classList.add('active');
}

Document.prototype.addScriptToUI = function(config) {
  if (!this._scriptsContainer) return;
  var compiled = this._scriptTemplate(config);
  this._scriptsContainer.innerHTML += compiled;
};

//Deprecated
Document.prototype.getParams = function() {
  return this._utils.parseSearch(this._globals._window.location.search);
};

Document.prototype.addScriptsContainer = function() {
  if (!this.container()) return;
  this._scriptsContainer = this.container().querySelector('table.scripts tbody');
  this._scriptTemplate = _.template(this.container().querySelector('#scriptTemplate').innerHTML);
};

Document.prototype.onDOMContentLoaded = function() {
  if (!this.container() || this.autoRunner) return;
  this.addSampleRange();
  this.addInfo();
  this.addScriptsContainer();
  this.loopBtn = document.querySelector('.loopBtn');
  this.onceBtn = document.querySelector('.onceBtn');
  this.twentyFiveBtn = document.querySelector('.twentyFiveBtn');
};

Document.prototype.observeBtns = function () {
  if (!this.btnObserver) this.btnObserver = Rx.Observable.
      fromEvent(document.querySelectorAll('.bp-btn'), 'click');
  return this.btnObserver;
}

Document.prototype.writeReport = function(reportContent) {
  this.infoDiv.innerHTML = reportContent;
};



di.annotate(Document, new di.Inject(Globals, RunState, ClientScripts, Utils));

module.exports = Document;
