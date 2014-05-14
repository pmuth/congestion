var express = require("express")
  , app = express()
  , http = require("http").createServer(app)
  , io = require("socket.io").listen(http)
  , _ = require("underscore");


var participants = []
var screens = []

//Server's IP address
//app.set("ip", "192.168.2.249");

//Server's port number

//var port = process.env.PORT || 8000;

app.set("port", process.env.PORT || 8000);

//Specify the views folder
app.set("views", __dirname + "/views");

//View engine is Jade
app.set("view engine", "jade");

//Specify where the static content is
app.use(express.static("public", __dirname + "/public"));

//Tells server to support JSON, urlencoded, and multipart requests
app.use(express.bodyParser());

var counter = 0;

app.get("/", function(request, response) {
	response.render("index");
});

app.get("/controller", function(request, response) {
	response.render("controller");
});

app.get("/controller2", function(request, response) {
	response.render("controller2");
});

app.get("/congestion", function(request, response) {
	response.render("congestion");
});

app.get("/maze", function(request, response) {
	response.render("maze");
});

/* Socket.IO events */
io.on("connection", function(socket) {

socket.on("newUser", function(data) {
	participants.push({id: data.id});
	console.log(data.color)
	//io.sockets.emit("newIndex", {participants: participants});
	io.sockets.emit("newConnection", {participants: participants, id: data.id, name: data.name, color: data.color});
	
});

socket.on("newScreen", function(data) {
	screens.push({id: data.id});
	console.log(screens.length);
	//io.sockets.emit("newIndex", {participants: participants});
	//io.sockets.emit("newConnection", {participants: participants, id: data.id});

});

socket.on("colorChange", function(data) {
	_.findWhere(participants, {id: socket.id}).color = data.color;
	console.log(participants);
	io.sockets.emit("colorChanged", {id: data.id, color: data.color});
});

socket.on("directionChange", function(data) {
	//_.findWhere(participants, {id: socket.id}).direction = data.direction;
	//console.log(participants);
	//io.sockets.emit("directionChanged", {id: data.id, direction: data.direction});
	io.sockets.emit("directionChanged", {id: data.id, tiltLR: data.tiltLR, tiltFB: data.tiltFB});
});

socket.on("disconnect", function() {
	participants = _.without(participants, _.findWhere(participants, {id: socket.id}));
	io.sockets.emit("userDisconnected", {id: socket.id, sender: "system"});
});

io.sockets.emit("newIndex", {participants: participants});

});

// http.listen(app.get("port"), app.get("ip"), function() {
// 	console.log("Server up and running. Go to http://" + app.get("ip") + ":" + app.get("port"));
// });



http.listen(app.get("port"), function() {
	console.log("Server up and running. Go to http://" + app.get("port"));
});