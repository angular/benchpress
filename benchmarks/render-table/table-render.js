(function() {
  var element = document.querySelector('#tableContainer');
  bp.variables.addMany([{
    value: 'baseline'
  },{
    value: 'colorful'
  }]);

  window.benchmarkSteps.push({
    name: 'cleanup',
    fn: function() {
      element.innerHTML = '';
    }
  });

  window.benchmarkSteps.push({
    name: 'table renderer',
    description: 'Create a table with 1000 rows and 20 columns',
    fn: function() {
      var table, tr, td;
      table = document.createElement('table');
      element.appendChild(table);
      for (var i=0; i<1000; i++) {
        tr = document.createElement('tr');
        table.appendChild(tr);
        for (var j=0; j<20; j++) {
          td = document.createElement('td');
          td.innerText = '' + i + j;
          if (bp.variables.selected && bp.variables.selected.value === 'colorful') {
            td.style.backgroundColor =
              'rgb(' +
              Math.round(Math.random() * 255) + ', ' +
              Math.round(Math.random() * 255) + ', ' +
              Math.round(Math.random() * 255) + ')';
          }
          tr.appendChild(td);
        }
      }
    }
  });
})();
