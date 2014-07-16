// === BEGIN: KUE SETUP ===
var kue = require('kue')
  , url = require('url')
  , redis = require('kue/node_modules/redis');

var redisUrl = url.parse(process.env.REDISCLOUD_URL);

var jobs = kue.createQueue({
  prefix: 'q',
  redis: {
    port: redisUrl.port,
    host: redisUrl.hostname,
    auth: redisUrl.auth.split(":")[1],
    options: {
      // look for more redis options in [node_redis](https://github.com/mranney/node_redis)
    }
  },
  disableSearch: true
});
// === END: KUE SETUP ===

// see https://github.com/learnBoost/kue/ for how to do more than one job at a time
jobs.process('crawl', function(job, done) {
  console.log(job.data);
  done();
});
