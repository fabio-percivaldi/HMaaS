# HMaaS

## Getting started
First install the dependencies
```
npm ci
```

Now copy the default.env file and customize the values

In order to start the service an instance of Redis must be running, to do so use docker:
```
docker run --name redis -p 6379:6379 -d redis
```

Finally run the service
```
set -a && source local.env && npm start
```

## Users
Enabled users are provided as a list of user:password values separated by a comma -> ex:
```
USERS=user1:password1,user2:password2
```

## Metrics
On the route `/-/metrics` are exposed Prometheus metrics

## Swagger
On the route `/api/docs` is exposed the swagger of the API

TODOS:
~~refactoring dei test~~
~~usare funzioni di redis da hasmap e non funzioni wrapper~~
~~redis_prefix~~
~~leggere users da env~~