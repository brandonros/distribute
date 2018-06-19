var Promise = require('bluebird');
var redis = require('redis');

Promise.promisifyAll(redis);

var client = redis.createClient();

module.exports = {
  queueJob: async function(type, job) {
    //console.log(`${new Date()} Queueing ${type} job...`);

    var stringifiedJob = JSON.stringify(job);

    return (await client.lpushAsync(`jobs:${type}`, stringifiedJob));
  },
  dispatchJob: async function(type) {
    //console.log(`${new Date()} Dispatching ${type} job...`);

    var job = await client.rpoplpushAsync(`jobs:${type}`, `dispatched_jobs:${type}`);

    if (job) {
      job = JSON.parse(job);
    }

    return job;
  },
  cleanupJob: async function(type, job) {
    //console.log(`${new Date()} Cleaning up ${type} job...`);

    var stringifiedJob = JSON.stringify(job);

    return (await client.lremAsync(`dispatched_jobs:${type}`, 0, stringifiedJob));
  },
  waitForDrain: async function(type) {
    //console.log(`${new Date()} Waiting for ${type} drain...`);

    for (;;) {
      var queueDepth = await client.llenAsync(`jobs:${type}`);

      if (queueDepth === 0) {
        return;
      }

      await Promise.delay(1000);
    }
  }
};
