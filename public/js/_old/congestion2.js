var serverBaseUrl = document.domain;
 
var socket = io.connect(serverBaseUrl);
 
var sessionId = ''; 

var enemies = []
//i = 0,
//enemy

var players = []
//i = 0,

var barriers = []

var goodCounter = 0;

createEnemies();
createBarriers();

function createBarriers() {
	var barrierSize = {
		x: 25,
		y: 500
	}

	//var barrierSize = {x: 342, y:121}
	var point = new Point(100, 100);
	var barrier = new Path.Rectangle(point, [barrierSize.x, barrierSize.y]);
	barrier.fillColor = 'yellow';
	barrier.width = barrierSize.x;
	barrier.height = barrierSize.y
	barriers.push(barrier);
	var barrierSize2 = {x: 500, y:25}
	var point2 = new Point(125, 100);
	var barrier2 = new Path.Rectangle(point2, [barrierSize2.x, barrierSize2.y]);
	barrier2.fillColor = 'green'
	barrier2.width = barrierSize2.x;
	barrier2.height = barrierSize2.y
	barriers.push(barrier2);
	var barrierSize3 = {x: 25, y:300}
	var point3 = new Point(625, 100);
	var barrier3 = new Path.Rectangle(point3, [barrierSize3.x, barrierSize3.y]);
	barrier3.fillColor = 'orange'
	barrier3.width = barrierSize3.x;
	barrier3.height = barrierSize3.y
	barriers.push(barrier3);
	var barrierSize4 = {x: 400, y:25}
	var point4 = new Point(225, 375);
	var barrier4 = new Path.Rectangle(point4, [barrierSize4.x, barrierSize4.y]);
	barrier4.fillColor = 'red'
	barrier4.width = barrierSize4.x;
	barrier4.height = barrierSize4.y
	barriers.push(barrier4); 
}

function createEnemies() {

var numEnemies = 100;

for( i = 0; i < numEnemies; i ++ ){

	var enemySize = {
		x: 20,
		y: 20
	}

	var point = new Point.random();
		point.x = point.x*view.size.width;
		point.y = point.y*view.size.height;	
	
	var enemy = new Path.Rectangle({
	 point: [point.x, point.y], 
	 size: [enemySize.x, enemySize.y],
	}); 
	
	enemy.width = enemySize.x;
	enemy.height = enemySize.y;
	enemy.polarity = Math.floor(Math.random()*2) == 1 ? 1 : 0
	if (enemy.polarity) {
		enemy.fillColor = 'blue'
	}
	else 
		enemy.fillColor = 'red'
	enemy.velocityX = Math.random() * 3 * (Math.floor(Math.random()*2) == 1 ? 1 : -1);
	enemy.velocityY = Math.random() * 3 * (Math.floor(Math.random()*2) == 1 ? 1 : -1);
	enemies.push( enemy )
	console.log(enemy.polarity)
}

}

function createPlayer(id) {

	var playerSize = {
		x: 15,
		y: 15
	}

	var point = new Point.random();
		point.x = point.x*view.size.width;
		point.y = point.y*view.size.height;	
	
	var player = new Path.Rectangle(point, playerSize);
	var player = new Path.Rectangle({
		point: [point.x, point.y],
		size: [playerSize.x, playerSize.y],
		fillColor: 'blue'
	}) 
	player.name = id;
	player.width = playerSize.x;
	player.height = playerSize.y;
	player.tiltLR = 0;
	player.tiltFB = 0;
	player.counter = 0;
	players.push(player);

}

function barrierDetectionPlayer(player, barrier) {

  var collisionLimit = {
  	x: player.width/2 + barrier.width/2,
  	y: player.height/2 + barrier.height/2
  }

  var distDifference = {
  	x: player.position.x-barrier.position.x,
  	y: player.position.y-barrier.position.y
  }
  var pushBack = {
  	x: 0, 
  	Y: 0
  }

  if ((Math.abs(distDifference.x) <= collisionLimit.x) && (Math.abs(distDifference.y) <= collisionLimit.y)) {

  	if (distDifference.x > 0) {
  		pushBack.x = 10;
  	} else {
  		pushBack.x = -10;
  	}

  	if (distDifference.y > 0) {
  		pushBack.y = 10;
  	} else {
  		pushBack.y = -10;
  	}

  	player.position.x += pushBack.x;
  	player.position.y += pushBack.y;

  }

}

function barrierDetectionEnemy(player, barrier) {

 var collisionLimit = {
  	x: player.width/2 + barrier.width/2,
  	y: player.height/2 + barrier.height/2
  }

  var distDifference = {
  	x: player.position.x-barrier.position.x,
  	y: player.position.y-barrier.position.y
  }

  if ((Math.abs(distDifference.x) <= collisionLimit.x) && (Math.abs(distDifference.y) <= collisionLimit.y)) {

  	player.velocityX = -(player.velocityX);
  	player.velocityY = -(player.velocityY);

  }

}

function movePlayer(player) {

	player.velocityX = Math.round(player.tiltLR*.25);
	player.velocityY = Math.round(player.tiltFB*.25);

	for (i = 0; i < players.length; i++) {
	 	for (j = 0; j < barriers.length; j++) {
	 	barrierDetectionPlayer(players[i], barriers[j]);
	 }
	}

	player.position.x += player.velocityX;
	player.position.y += player.velocityY;

}

function moveEnemy(enemy) {
 		
 	for (j = 0; j < barriers.length; j++) {
	 	barrierDetectionEnemy(enemy, barriers[j]);
	 }

	enemy.position.x += enemy.velocityX;
 	enemy.position.y += enemy.velocityY;
}

function onFrame( event ){

	enemies.forEach(moveEnemy);
	enemies.forEach(outOfBounds);

 	players.forEach( function( player ){

 	for (i = 0; i < enemies.length; i++) {
 	var hit = collisionDetection(player, enemies[i])
 	if (hit == 1) {
 		enemies.splice(i, 1);
 	}
 }
});

 // 	var ele = document.getElementById('score');
	// var con = ele.getContext('2d');
	// con.clearRect(0, 0, ele.width, ele.height);

 // 	for (i = 0; i < players.length; i++) {
 // 		//barrierDetection(players[i], barrier);
	// 	con.font =  "24px serif" 
	// 	con.fillStyle    = players[i].color;
	// 	con.fillText ( players[i].name,  10,(i+1)*100);
	// 	con.fillText ( players[i].counter, 10,((i+1)*100)+30);
 // 	}

 	updateScore();

 	players.forEach(movePlayer);
 	players.forEach(outOfBounds);
 	
 }

function collisionDetection(player, enemy) {

 var collisionLimit = {
  	x: player.width/2 + enemy.width/2,
  	y: player.height/2 + enemy.height/2
  }

  var distDifference = {
  	x: player.position.x-enemy.position.x,
  	y: player.position.y-enemy.position.y
  }

  if ((Math.abs(distDifference.x) <= collisionLimit.x) && (Math.abs(distDifference.y) <= collisionLimit.y)) {

  	player.counter++;
  	enemy.remove();
  	console.log(player.name + "    " + player.counter);
  	return 1

  }

  return 0

}

function outOfBounds(square) {

 	if (square.bounds.left > view.size.width) {
		square.position.x = 0;
	}
	if (square.bounds.top > view.size.height) {
		square.position.y = -10;
	}
	if (square.position.y < -10) {
		square.position.y = view.size.height+10;
	}
	if (square.bounds.right < 0) {
		square.position.x = view.size.width+10;
	}

}

function removePlayer(id) {

for (i = 0; i < players.length; i++) {

	if (players[i].name == id) {		
		console.log(players[i]);
		players[i].remove();
		players.length;
		players.splice(i, 1);
	}	

}
    console.log(players.length);
    console.log(id + " has left the server");

}

function updateScore() {

	var ele = document.getElementById('score');
	var con = ele.getContext('2d');
	con.clearRect(0, 0, ele.width, ele.height);

 	for (i = 0; i < players.length; i++) {
 		//barrierDetection(players[i], barrier);
		con.font =  "24px serif" 
		con.fillStyle    = players[i].color;
		con.fillText ( players[i].name,  10,(i+1)*100);
		con.fillText ( players[i].counter, 10,((i+1)*100)+30);
 	}
}

//SOCKET

socket.on('newConnection', function(data) {
   	createPlayer(data.id);
    console.log(players.length);
    console.log(data.id + " has joined the server");  
});

socket.on('userDisconnected', function(data) {

	var id = data.id;
	removePlayer(id);
});

socket.on('directionChanged', function(data) {
	id = data.id;

	players.forEach( function( player ){

	if (player.name == id) {
		 player.tiltLR = data.tiltLR;
		 player.tiltFB = data.tiltFB;
	}	
	});

});

socket.on('connect', function () {
    sessionId = socket.socket.sessionid;
    socket.emit('newScreen', {id: sessionId});
    console.log("!!!!!!")
});

function listParticipants(participants) {
    $('#participants').html('');
    for (var i = 0; i < participants.length; i++) {
        $('#participants').append('<div class="square" id="' + participants[i].id + '" style="background-color:'+participants[i].color + '">' +
        participants[i].id + ' ' + (participants[i].id === sessionId ? '(You)' : '') + '<br /></span>');
        console.log(participants[i].direction + "?????");
    }
}

socket.on('newIndex', function(data) {
  listParticipants(data.participants);
  console.log("PARTICIPANTS LOADED")
})

function scoring (player) { 
	var ele = document.getElementById('score');
	var con = ele.getContext('2d');
	con.clearRect(0, 0, ele.width, ele.height);

	con.font =  "24px serif" 
	con.fillStyle    = player.color;
	con.fillText ( player.name,  10,100);
	con.fillText ( player.counter, 10, 130);
}

//window.setInterval(100);

//SUPER OLD

// function listParticipants(participants) {
//     $('#participants').html('');
//     for (var i = 0; i < participants.length; i++) {
//         $('#participants').append('<div class="square" id="' + participants[i].id + '" style="background-color:'+participants[i].color + '">' +
//         participants[i].id + ' ' + (participants[i].id === sessionId ? '(You)' : '') + '<br /></span>');
//         console.log(participants[i].direction + "?????");
//     }
// }

//}

//$(document).on('ready', init);