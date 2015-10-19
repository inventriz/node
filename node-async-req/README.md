

# Parallelism with async.js

This is a sample application to demo parallelism from browser using async.js module

## Usage

- Deploy search and listing service locally
- go to the project folder
- run npm install
- open browser and access http://localhost:3000/
- type search key word and hit enter


## Developing

Call graph before parallelism.

![Alt text](https://github.com/inventriz/node/blob/master/node-async-req/public/images/mainjs.jpg?raw=true "Call graph before parallelism")

## parallel request for image and review for each search result
Call graph 2 with image and search request in parallel.
- Open main.html
- change the script reference from main.js to main1.js
- save and run the app
- this will use async.js with async.parallel()
- this will invoke image and review reqest concurrently

![Alt text](https://github.com/inventriz/node/blob/master/node-async-req/public/images/main1js.jpg?raw=true "Call graph after parallelism")

## parallel request for all search result search result along with image and review
Call graph 3 with image and search request in parallel.

- Open main.html
- change the script reference from main1.js to main2.js
- save and run the app
- this will use async.js with async.each() and async.parallel()
- this will invoke all the search result in parallel along with image and review reqest concurrently

![Alt text](https://github.com/inventriz/node/blob/master/node-async-req/public/images/main2js.jpg?raw=true "Call graph 3 after parallelism")


### Tools

Created with [Nodeclipse](https://github.com/Nodeclipse/nodeclipse-1)
 ([Eclipse Marketplace](http://marketplace.eclipse.org/content/nodeclipse), [site](http://www.nodeclipse.org))   

Nodeclipse is free open-source project that grows with your contributions.
