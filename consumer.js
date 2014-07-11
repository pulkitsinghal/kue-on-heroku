var kue = require('kue')
  , url = require('url')
  , redis = require('kue/node_modules/redis');
 
kue.redis.createClient = function() {
    var redisUrl = url.parse(process.env.REDISCLOUD_URL)
      , client = redis.createClient(redisUrl.port, redisUrl.hostname);
    if (redisUrl.auth) {
        client.auth(redisUrl.auth.split(":")[1]);
    }
    return client;
};
 
var jobs = kue.createQueue();
 
// see https://github.com/learnBoost/kue/ for how to do more than one job at a time
jobs.process('crawl', function(job, done) {
  console.log(job.data);
  done();
});
