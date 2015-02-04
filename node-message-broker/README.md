# Message Broker Using Node

This code example will show how to use node to develop a simple message broker. The communication between message broker server and client will be through socket.


## Usage



### Run the server
- Navigate to the project folder
- Run the following command

node msgbrokerServer.js [port]

port - mention the port where you want to run the server

### Run the client 1
- open command prompt
- navigate to the project folder and run the following command

node socketClient.js [name1] [host] [port]

name - some name to identify the client e.g. client1
host - remote server host to connect to
port - port on which the server is running

### Run the client 2
- open command prompt
- navigate to the project folder
- run another client with the following command

node socketClient.js [name1] [host] [port]

### Similarly you can run other clients as well

- Go to any client command prompt
- Type anything and press [enter]
- You will see this typed string is brodcasted across all the other client
- This is happening using TCP socket communication 


