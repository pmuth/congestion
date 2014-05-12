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

function createBarriers() {
	var barrierSize = 100;
	var point = new Point(400, 400);
	var barrier = new Path.Rectangle(point, barrierSize);
	barrier.fillColor = 'yellow';
	barrier.size = barrierSize;
	barriers.push(barrier);
	var point2 = new Point(123, 678);
	var barrier2 = new Path.Rectangle(point2, barrierSize);
	barrier2.fillColor = 'green'
	barrier2.size = barrierSize;
	barriers.push(barrier2);

	 
}


//console.log(canvas.width)

function barrierDetectionPlayer(player, barrier) {

  var circleRadius = player.size/2;
  var halfSidelength = barrier.size/2;
  var collisionLimit = circleRadius+halfSidelength;
  var xDifference = player.position.x-barrier.position.x;
  var yDifference = player.position.y-barrier.position.y;
  var pushBackX, pushBackY;

  if ((Math.abs(xDifference) <= collisionLimit) && (Math.abs(yDifference) <= collisionLimit)) {

  	if (xDifference > 0) {
  		pushBackX = 5;
  	} else {
  		pushBackX = -5;
  	}

  	  	if (yDifference > 0) {
  		pushBackY = 5;
  	} else {
  		pushBackY = -5;
  	}

  	player.position.x = player.position.x + pushBackX;
  	player.position.y = player.position.y + pushBackY;

  }


}

function barrierDetectionEnemy(player, barrier) {

  var circleRadius = player.size/2;
  var halfSidelength = barrier.size/2;
  var collisionLimit = circleRadius+halfSidelength;
  var xDifference = player.position.x-barrier.position.x;
  var yDifference = player.position.y-barrier.position.y;
  var pushBackX, pushBackY;

  if ((Math.abs(xDifference) <= collisionLimit) && (Math.abs(yDifference) <= collisionLimit)) {

  	player.velocityX = -(player.velocityX);
  	player.velocityY = -(player.velocityY);

  	//player.position.x = player.position.x + pushBackX;
  	//player.position.y = player.position.y + pushBackY;

  }


}

createBarriers();
console.log(barriers[0].size);

function createEnemies() {
for( i = 0; i < 100; i ++ ){

	var point = new Point.random();
	point.x = point.x*900;
	point.y = point.y*900;
	//console.log(point);
	var enemySize = 20;
	var enemy = new Path.Rectangle( point, enemySize )
	enemy.color = 'purple'
	enemy.size = enemySize;
	enemy.fillColor = enemy.color
	enemy.velocityX = Math.random() * 3;
	enemy.velocityX *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
	enemy.velocityY = Math.random() * 3;
	enemy.velocityY *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
	enemies.push( enemy )
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
 		enemy.position.x += enemy.velocityX;
 		enemy.position.y += enemy.velocityY;
 			 	for (j = 0; j < barriers.length; j++) {
	 	barrierDetectionEnemy(enemy, barriers[j]);
	 }
 		//barrierDetectionEnemy(enemy, barriers[0])
}

console.log("YES?");

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

 	players.forEach(movePlayer);
 	players.forEach(outOfBounds);
 	
 }


function collisionDetection(player, enemy) {

  var circleRadius = player.size/2;
  var halfSidelength = enemy.size/2;
  var collisionLimit = circleRadius+halfSidelength;
  var xDifference = Math.abs(player.position.x-enemy.position.x);
  var yDifference = Math.abs(player.position.y-enemy.position.y);

  if ((xDifference <= collisionLimit) && (yDifference <= collisionLimit)) {

  	player.counter++;
  	enemy.remove();
  	console.log(player.name + "    " + player.counter);

  	return 1

  }

  return 0

}

function createPlayer(id) {

	var point = new Point.random();
	point.x = point.x*900;
	point.y = point.y*900;
	var playerSize = 15;
	var player = new Path.Rectangle(point, playerSize); 
	player.name = id;
	player.size = playerSize;
	player.tiltLR = 0;
	player.tiltFB = 0;
	//player.color = '#'+Math.floor(Math.random()*16777215).toString(16);
	player.color = 'blue'
	player.counter = 0;
	player.fillColor = player.color;
	player.fillColor.alpha = 1.0;
	players.push(player);
	console.log(player.name);
	console.log(player.size);

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

  socket.on('newConnection', function(data) {
   	createPlayer(data.id);
    console.log(players.length);
    console.log(data.id + " has joined the server");  
});
 
  socket.on('userDisconnected', function(data) {

    id = data.id;

for (i = 0; i < players.length; i++) {

	if (players[i].name == data.id) {		
		console.log(players[i]);
		players[i].remove();
		players.length;
		players.splice(i, 1);
	}	

}
    console.log(players.length);
    console.log(data.id + " has left the server");
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
// 	con.fillText(player.id, 50, 100);
// 	con.fillText(player.counter, 50, 200);
// }


//OLD

// var middle = new Point(440, 440);
// var playerOne = new Path.Rectangle(middle, 35); 
// playerOne.fillColor = 'yellow';
// playerOne.fillColor.alpha = 1.0;
// 		playerOne.velocityX = 0;
//  		playerOne.velocityY = 0;


//SUPER OLD

// function listParticipants(participants) {
//     $('#participants').html('');
//     for (var i = 0; i < participants.length; i++) {
//         $('#participants').append('<div class="square" id="' + participants[i].id + '" style="background-color:'+participants[i].color + '">' +
//         participants[i].id + ' ' + (participants[i].id === sessionId ? '(You)' : '') + '<br /></span>');
//         console.log(participants[i].direction + "?????");
//     }
// }

// socket.on('newIndex', function(data) {
//   listParticipants(data.participants);
//   console.log("PARTICIPANTS LOADED")
// })



//}

//$(document).on('ready', init);