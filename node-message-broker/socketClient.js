var net = require('net');
var args = process.argv.slice(2);
var clientName = args[0];
var remoteHost = args[1];
var remotePort = args[2];

if(clientName === undefined || remoteHost === undefined || remotePort === undefined){
  console.log("Invalid argument!");
  console.log("Please run: node socket_client.js <ClientName> <RemoteHost> <RemotePort>");
  process.exit(0);
}


function getConnection(connName){
  try{
     var client = net.connect({port: remotePort, host:remoteHost}, function() {
      console.log(connName + ' Connected: ');
      console.log('   local = %s:%s', this.localAddress, this.localPort);
      console.log('   remote = %s:%s', this.remoteAddress, this.remotePort);
      //this.setTimeout(500);
      this.setEncoding('utf8');
      this.on('data', function(data) {
        console.log(connName + " From Server: " + data.toString());
      });
      this.on('end', function() {
        console.log(connName + ' Client disconnected');
      });
      this.on('error', function(err) {
        console.log('Socket Error: ', JSON.stringify(err));
      });
      this.on('timeout', function() {
        console.log('Socket Timed Out');
      });
      this.on('close', function() {
        console.log('Socket Closed');
      });
    });
    return client; 
  } catch(err) {
    console.log(err);
  }
  
}
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

var clientConn = getConnection(clientName); // create a client connection

// getting the input from stdin 
process.stdin.setEncoding('utf8');
process.stdin.on('data', function (data) {
  writeData(clientConn, data);
});
process.stdin.resume();