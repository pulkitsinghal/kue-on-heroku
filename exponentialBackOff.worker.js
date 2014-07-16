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

var minInterval = 1;
var interval = minInterval;
var exponent = 2;
var maxInterval = 60;

var setupJob = function() {
  var job = jobs.create('crawl', {
    url: 'http://example.com'
    , token: 'foo'
  });
  job.on('complete', function(){
    console.log("Job complete");
  }).on('failed', function(){
      res.send("Job failed");
    }).on('progress', function(progress){
      console.log('job #' + job.id + ' ' + progress + '% complete');
    });
  job.save();
};

var startProducer = function() {
  //var msg = queue.GetMessage();
  // maybe you get a message for Q, maybe you don't
  var myArray = ['value', null, null];
  var msg = myArray[Math.floor(Math.random() * myArray.length)];

  if (msg != null)
  {
    interval = minInterval;
    console.log('Interval reset to %d seconds', interval);

    // TODO: do something queue.DeleteMessage(msg);
    setupJob();

    startProducer();
  }
  else
  {
    console.log('Sleep for %d seconds', interval);
    // timeout after interval
    setTimeout(function() {
      startProducer();
    }, interval*1000);
    interval = Math.min(maxInterval, interval * exponent);
    console.log('Interval extended to %d seconds', interval);
  }
};

startProducer();
