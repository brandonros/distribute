var Promise = require('bluebird');
var now = require('performance-now');
var async = require('async');

var distribute = require('../lib/index.js');

async function dispatchJobs(jobs) {
  await Promise.map(jobs, async function(job) {
    await distribute.queueJob('queue1', job);
  }, {concurrency: 32});
}

(async function() {
  var ticks = 0;
  var start = now();

  var jobs = [];

  for (var i = 0; i < 10000; ++i) {
    jobs.push({accountNumber: i});
  }

  var producer = function() {
    async.forever(async function() {
      await dispatchJobs(jobs);

      ticks += jobs.length;

      if (ticks % 50000 === 0) {
        var elapsed = (now() - start) / 1000;

        console.log(new Date(), ticks / elapsed);
      }
    });
  }; 

  async.parallel([
    producer,
    producer,
    producer,
    producer,
    producer,
    producer,
    producer,
    producer,
    producer,
    producer,
    producer,
    producer,
    producer,
    producer,
    producer,
    producer,
    producer,
    producer,
    producer,
    producer,
    producer,
    producer,
    producer,
    producer,
    producer,
    producer,
    producer,
    producer,
    producer,
    producer,
    producer,
    producer
  ]);
})();

process.on('unhandledRejection', function(err) {
  console.error(err.stack);
  process.exit(1);
});
