var Promise = require('bluebird');
var now = require('performance-now');
var async = require('async');

var distribute = require('../lib/index.js');

async function processJob(cb) {
  var job = await distribute.dispatchJob('queue1');

  if (!job) {
    return;
  }

  //console.log(`${new Date()} Got job ${JSON.stringify(job)}`);

  var result = await cb(job);

  //console.log(`${new Date()} Job result ${JSON.stringify(result)}`);

  await distribute.cleanupJob('queue1', job);

  return result;
}

(async function() {
  var ticks = 0;
  var start = now();

  var consumer = function() {
    async.forever(async function() {
      var result = await processJob(async function(job) {
        return {
          output: job.input + 1
        };
      });

      if (!result) {
        return;
      }
       
      ticks += 1;

      if (ticks % 50000 === 0) {
        var elapsed = (now() - start) / 1000;

        console.log(new Date(), ticks / elapsed);
      }
    });    
  };

  async.parallel([
    consumer,
    consumer,
    consumer,
    consumer,
    consumer,
    consumer,
    consumer,
    consumer,
    consumer,
    consumer,
    consumer,
    consumer,
    consumer,
    consumer,
    consumer,
    consumer,
    consumer,
    consumer,
    consumer,
    consumer,
    consumer,
    consumer,
    consumer,
    consumer,
    consumer,
    consumer,
    consumer,
    consumer,
    consumer,
    consumer
  ]);

})();

process.on('unhandledRejection', function(err) {
  console.error(err.stack);
  process.exit(1);
});
