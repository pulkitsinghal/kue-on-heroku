This skeleton is derived from https://gist.github.com/mojodna/1251812

It runs a `producerWorker` continuously with a exponential backoff modeled on http://www.wadewegner.com/2012/04/simple-capped-exponential-back-off-for-queues/ that places jobs on Kue.

The `consumerWorker` fulfills the tasks that are placed on Kue.

You can have a look at the `Procfile` to determine the implementation for each worker. When testing locally via `foreman start`, you can setup a local redis instance or copy the settings from your heroku instance down into the `.env` file to make the connection.


But be warned that you'll end up consuming the connections offered by free plans like Redis Cloud, very quickly as this code doesn't place any upperbound on the total # of consumer jobs that are generated.
 A similar cautionary tale can be found for other job queuing frameworks as well: http://manuel.manuelles.nl/blog/2012/11/13/sidekiq-on-heroku-with-redistogo-nano/
