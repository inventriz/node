var net = require('net');
var events = require('events');

// check the input arg
var args = process.argv.slice(2);
var serverPort = args[0];
if(serverPort === undefined){
  console.log("Invalid argument! Please mention the port where the server should run.");
  process.exit(0);
}

var channel = new events.EventEmitter();
channel.clients = {};
channel.subscriptions = {};

channel.on('join', function(id, client) {
	this.clients[id] = client;
	this.subscriptions[id] = function(senderId, message) {
		if (id != senderId) {
			console.log("Sending to "+this.clients[id]);
			this.clients[id].write(message);
		}
	}
	this.on('broadcast', this.subscriptions[id]);
});
channel.on('leave', function(id) {
	channel.removeListener('broadcast', this.subscriptions[id]);
	console.log(id + " has left the chat.\n");
	//channel.emit('broadcast', id, id + " has left the chat.\n");
});


var server = net.createServer(function(client) {
  console.log('Client connection: ');
  console.log('   local = %s:%s', client.localAddress, client.localPort);
  console.log('   remote = %s:%s', client.remoteAddress, client.remotePort);
  //client.setTimeout(500);
  client.setEncoding('utf8');
  
  var id = client.remoteAddress + ':' + client.remotePort;
  channel.emit('join', id, client); // emit a 'join' event
  
  client.on('data', function(data) {
    console.log('Received data from client on port %d: %s', 
                client.remotePort, data.toString());
    console.log('  Bytes received: ' + client.bytesRead);
    //writeData(client, 'Sending: ' + data.toString());
	  channel.emit('broadcast', id, data); // brodcast to all the client present in the channel
    console.log('  Bytes sent: ' + client.bytesWritten);
  });
  client.on('close', function() {
    console.log('Client disconnected');
	  channel.emit('leave', id);
    server.getConnections(function(err, count){
      console.log('Remaining Connections: ' + count);
    });
  });
  client.on('error', function(err) {
    console.log('Socket Error: ', JSON.stringify(err));
  });
  client.on('timeout', function() {
    console.log('Socket Timed out');
  });
});

server.listen(serverPort, function() {
  console.log('Server listening: ' + JSON.stringify(server.address()));
  server.on('close', function(){
    console.log('Server Terminated');
  });
  server.on('error', function(err){
    console.log('Server Error: ', JSON.stringify(err));
  });
});

function writeData(socket, data){
  var success = !socket.write(data);
  if (!success){
    (function(socket, data){
      socket.once('drain', function(){
        writeData(socket, data);
      });
    })(socket, data);
  }  
}