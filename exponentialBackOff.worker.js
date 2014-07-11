var minInterval = 1;
var interval = minInterval;
var exponent = 2;
var maxInterval = 8;
var startProducer = function() {

  //var msg = queue.GetMessage();

  // maybe you get a message for Q, maybe you don't
  var myArray = ['value', null];
  var msg = myArray[Math.floor(Math.random() * myArray.length)];

  if (msg != null)
  {
    interval = minInterval;
    console.log('Interval reset to %d seconds', interval);
    // TODO: do something queue.DeleteMessage(msg);
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
