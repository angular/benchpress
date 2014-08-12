(function() {
  var element = document.querySelector('#counter');
  window.benchmarkSteps.push({
    name: 'speedy counter',
    fn: function() {
      for (var i = 0; i<1000; i++) {
        element.innerText = i;
      }
    }
  });
})();
