

# Parallelism with async.js

This is a sample application to demo parallelism from browser using async.js module

## Usage

- Deploy search and listing service locally
- go to the project folder
- run npm install
- open browser and access http://localhost:3000/
- type search key word and hit enter


## Developing

Call graph before parallelism

![Alt text](https://github.com/inventriz/node/blob/master/node-async-req/public/images/mainjs.jpg?raw=true "Call graph before parallelism")

## parallel request for image and review for each search result
Call graph 2 with image and search request in parallel

![Alt text](https://github.com/inventriz/node/blob/master/node-async-req/public/images/main1js.jpg?raw=true "Call graph after parallelism")

### Tools

Created with [Nodeclipse](https://github.com/Nodeclipse/nodeclipse-1)
 ([Eclipse Marketplace](http://marketplace.eclipse.org/content/nodeclipse), [site](http://www.nodeclipse.org))   

Nodeclipse is free open-source project that grows with your contributions.
