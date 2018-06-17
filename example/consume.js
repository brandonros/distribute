var Promise = require('bluebird');

var distribute = require('../lib/index.js');


async function consumeResults(cb) {
  for (;;) {
    var result = await distribute.dispatchResult('queue1');

    if (!result) {
      return;
    }

    await cb(result);

    await distribute.cleanupResult('queue1', result);
  }
}

(async function() {
  await consumeResults(async function(result) {
    console.log(result);
  });

  process.exit(0);
})();

process.on('unhandledRejection', function(err) {
  console.error(err.stack);
  process.exit(1);
});
