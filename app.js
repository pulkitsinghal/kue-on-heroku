var express = require('express')
  , kue = require('kue')
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
 
// then access the current Queue
var jobs = kue.createQueue()
  , app = express.createServer();

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

app.listen(process.env.PORT);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
