var Promise = require('bluebird');
var redis = require('redis');

Promise.promisifyAll(redis);

var client = redis.createClient();

module.exports = {
  queueJob: async function(type, job) {
    console.log(`${new Date()} Queueing ${type} job...`);

    var stringifiedJob = JSON.stringify(job);

    return (await client.lpushAsync(`jobs:${type}`, stringifiedJob));
  },
  dispatchJob: async function(type) {
    console.log(`${new Date()} Dispatching ${type} job...`);

    var job = await client.rpoplpushAsync(`jobs:${type}`, `dispatched_jobs:${type}`);

    if (job) {
      job = JSON.parse(job);
    }

    return job;
  },
  cleanupJob: async function(type, job) {
    console.log(`${new Date()} Cleaning up ${type} job...`);

    var stringifiedJob = JSON.stringify(job);

    return (await client.lremAsync(`dispatched_jobs:${type}`, 0, stringifiedJob));
  },
  queueResult: async function(type, result) {
    console.log(`${new Date()} Queueing ${type} results...`);

    var stringifiedResult = JSON.stringify(result);

    return (await client.lpushAsync(`results:${type}`, stringifiedResult));
  },
  dispatchResult: async function(type) {
    console.log(`${new Date()} Dispatching ${type} result...`);

    var result = await client.rpoplpushAsync(`results:${type}`, `dispatched_results:${type}`);

    if (result) {
      result = JSON.parse(result);
    }

    return result;
  },
  cleanupResult: async function(type, result) {
    console.log(`${new Date()} Cleaning up ${type} result...`);

    var stringifiedResult = JSON.stringify(result);

    return (await client.lremAsync(`dispatched_results:${type}`, 0, stringifiedResult));
  }
};
