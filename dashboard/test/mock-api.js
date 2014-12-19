angular.module('bpdMockAPI', []).
  value('mockAPI', {
    '/api/benchmarks': {
      benchmarks:[{
        name: 'largetable',
        description: 'a benchmark to draw a large table in many ways'
      },{
        name:'render-table',
        description: 'a normal sized table is destroyed and created'
      }]},
    '/benchmarks/largetable/scripts.json': {
      "scripts":[{
        "id":"jquery",
        "src":"jquery-noop.js"
      },{
        "id":"angular","src":"angular.js"
      },{
        "src":"app.js"
      }]}
  });
