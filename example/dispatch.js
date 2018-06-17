var Promise = require('bluebird');

var distribute = require('../lib/index.js');

async function dispatchJobs(jobs) {
  await Promise.each(jobs, async function(job) {
    await distribute.queueJob('queue1', job);
  });
}

(async function() {
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

  await dispatchJobs(jobs);

  process.exit(0);
})();

process.on('unhandledRejection', function(err) {
  console.error(err.stack);
  process.exit(1);
});
