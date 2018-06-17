var Promise = require('bluebird');

var distribute = require('../lib/index.js');

async function dispatchJobs() {
  var jobs = [
    {
      'input': 1
    },
    {
      'input': 2
    },
    {
      'input': 3
    },
    {
      'input': 4
    },
    {
      'input': 5
    }    
  ];

  await Promise.each(jobs, async function(job) {
    await distribute.queueJob('queue1', job);
  });
}

async function processJobs(cb) {
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

async function consumeResults() {
  var result = await distribute.dispatchResult('queue1');

  if (!result) {
    return;
  }

  await distribute.cleanupResult('queue1', result);
}

(async function() {
  for (;;) {
    await dispatchJobs();

    await processJobs(async function(job) {
      return {
        output: job.input + 1
      };
    });

    await consumeResults();
  }
})();

process.on('unhandledRejection', function(err) {
  console.error(err.stack);
  process.exit(1);
});
