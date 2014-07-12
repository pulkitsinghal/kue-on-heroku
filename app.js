var express = require('express')
  , kue = require('kue')
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
    }
  })
  , app = express();

// create a dummy job
app.get('/', function(req, res) {
    var job = jobs.create('crawl', {
        url: 'http://example.com'
      , token: 'foo'
    });
    job.on('complete', function(){
        // avoid sending data after the response has been closed
        if (res.finished) {
            console.log("Job complete");
        } else {
            res.send("Job complete");
        }
    }).on('failed', function(){
        if (res.finished) {
            console.log("Job failed");
        } else {
            res.send("Job failed");
        }
    }).on('progress', function(progress){
        console.log('job #' + job.id + ' ' + progress + '% complete');
    });
    job.save();
    // timeout after 5s
    setTimeout(function() {
        res.send("OK (timed out)");
    }, 5000);
});

// wire up Kue (see /active for queue interface)
app.use(kue.app);

var server = app.listen(process.env.PORT, function() {
  console.log('Listening on port %d', server.address().port);
});
