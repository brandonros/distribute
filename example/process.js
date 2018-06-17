var Promise = require('bluebird');

var distribute = require('../lib/index.js');

async function processJobs(cb) {
  for (;;) {
    var job = await distribute.dispatchJob('queue1');

    if (!job) {
      return;
    }

    console.log(`${new Date()} Got job ${JSON.stringify(job)}`);

    var result = await cb(job);

    console.log(`${new Date()} Job result ${JSON.stringify(result)}`);

    await distribute.queueResult('queue1', result);

    await distribute.cleanupJob('queue1', job);
  }
}

(async function() {
  await processJobs(async function(job) {
    return {
      output: job.input + 1
    };
  });
  
  process.exit(0);
})();

process.on('unhandledRejection', function(err) {
  console.error(err.stack);
  process.exit(1);
});
