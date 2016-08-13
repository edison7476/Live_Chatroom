
var express = require('express');
var app = express();
var path = require('path')
app.set('views', __dirname + '/views');
app.set('views engine', 'ejs');

/**
var server = require('http').createServer(app); 
server.listen(8000, function (){
	console.log('Listening on port 8000')
});
**/
// the above action of creating a server can be also done by the following:
var server = app.listen(8000,function (){
	console.log('Listening on port 8000')
 });

//---- The following code can be put on the routes folder
//--- to make it more organizable
var io = require('socket.io').listen(server);

app.get('/', function (req,res){
	res.render('index.ejs')
});

// socket functionality // turn on connection to socket.io
// this is similar to jQuery's $(document).ready(function (){})
// All the socket codes go inside here
var all_users=[];


io.sockets.on('connection', function (socket){
	console.log('socket.io connected');
	console.log(socket.id);

	function updateName(){
	io.emit('response_new_user', all_users)
		}

	socket.on('new_user', function(data, callback){
	//Check if the user name already exits	
		if(all_users.indexOf(data) != -1){
			console.log(all_users.indexOf(data));
			callback(false);
		}
		else{
			console.log(data);
			console.log(all_users.indexOf(data));
			callback(true);
			socket.name = data;
			all_users.push(data);
			console.log(all_users);
			updateName(); //update the users list whenever a new user enter
		}
	});

	//socket function hadling the client request with the name 'send-message'
	socket.on('send_message', function (data){
		console.log('recieved client request "send_message" ')
		console.log(data);
		//server response with the name 'new_message'. We use .emit method to send data to all the users
		io.emit('new_message', data); //pass the data from our function parameter to the client side
		console.log(data)				// use io.emit to response all clients in the server
	});// server responeded ! Message goes back to the client side 
		// now we need to create another socket on the client side to handle the server's response

	socket.on('disconnect', function(data){
		if(!socket.name) {
			return}
		else{
			console.log(all_users.indexOf(socket.name));
			all_users.splice(all_users.indexOf(socket.name),1);
			updateName(); // update the user list whenever someone left
			}
	});

});
