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
npm start
```



TODOS:
~~refactoring dei test~~
~~usare funzioni di redis da hasmap e non funzioni wrapper~~
~~redis_prefix~~
* leggere users da env