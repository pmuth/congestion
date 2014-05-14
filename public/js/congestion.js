var serverBaseUrl = document.domain;
 
var socket = io.connect(serverBaseUrl);
 
var sessionId = ''; 

var enemies = []
//i = 0,
//enemy

var players = []
//i = 0,

var barriers = []

var playerPieces = []

var goodCounter = 0;
var hitCounter = 0;
var time

createEnemies();
//createBarriers();

function createBarriers() {
	var barrierSize = {
		x: 25,
		y: 500
	}

	//var barrierSize = {x: 342, y:121}
	var point = new Point(100, 100);
	var barrier = new Path.Rectangle(point, [barrierSize.x, barrierSize.y]);
	barrier.fillColor = '#0DFF30';
	barrier.width = barrierSize.x;
	barrier.height = barrierSize.y
	barriers.push(barrier);
	var barrierSize2 = {x: 500, y:25}
	var point2 = new Point(125, 100);
	var barrier2 = new Path.Rectangle(point2, [barrierSize2.x, barrierSize2.y]);
	barrier2.fillColor = '#C3E80C'
	barrier2.width = barrierSize2.x;
	barrier2.height = barrierSize2.y
	barriers.push(barrier2);
	var barrierSize3 = {x: 25, y:300}
	var point3 = new Point(625, 100);
	var barrier3 = new Path.Rectangle(point3, [barrierSize3.x, barrierSize3.y]);
	barrier3.fillColor = '#FFC100'
	barrier3.width = barrierSize3.x;
	barrier3.height = barrierSize3.y
	barriers.push(barrier3);
	var barrierSize4 = {x: 400, y:25}
	var point4 = new Point(225, 375);
	var barrier4 = new Path.Rectangle(point4, [barrierSize4.x, barrierSize4.y]);
	barrier4.fillColor = '#E8660C'
	barrier4.width = barrierSize4.x;
	barrier4.height = barrierSize4.y
	barriers.push(barrier4); 
}

function createEnemies() {

var numEnemies = 100;

for( i = 0; i < numEnemies; i ++ ){

	var enemySize = {
		x: 15,
		y: 15
	}

	var point = new Point.random();
		point.x = point.x*view.size.width;
		point.y = point.y*view.size.height;	
	
	var enemy = new Path.Rectangle({
	 point: [point.x, point.y], 
	 size: [enemySize.x, enemySize.y],
	}); 

	enemy.polarity = Math.floor(Math.random()*2) == 1 ? 1 : 0
	enemy.hitTime = 0;
	if (enemy.polarity) {
		enemy.color = '#0D55FF'
	}
	else 

	enemy.color = 'FF0000'
	enemy.fillColor = enemy.color
	enemy.power = 1;
	enemy.velocityX = Math.random() * 2.5 * (Math.floor(Math.random()*2) == 1 ? 1 : -1);
	enemy.velocityY = Math.random() * 2.5 * (Math.floor(Math.random()*2) == 1 ? 1 : -1);
	enemies.push( enemy )

}

}

function createPlayer(id, name, color) {

	var playerSize = {
		x: 20,
		y: 20
	}

	var point = new Point();
		point.x = view.size.width/2;
		point.y = view.size.height/2;	
	
	//var player = new Path.Rectangle(point, playerSize);
	var player = new Path.Rectangle({
		point: [point.x, point.y],
		size: [playerSize.x, playerSize.y],
		fillColor: color
	}) 

	// var player = new Path.Circle({
	// 	center: [point.x, point.y],
	// 	radius: playerSize.x/2,
	// 	fillColor: color
	// })
	player.name = id;
	player.color = color;
	player.nickname = name;
	player.tiltLR = 0;
	player.tiltFB = 0;
	player.counter = 0;
	player.hitCounter = 0;
	players.push(player);

}

function onFrame( event ){
	time = event.time;

	enemies.forEach(moveEnemy);
	enemies.forEach(outOfBounds);

	playerPieces.forEach(moveEnemy);

 	players.forEach(movePlayer);
 	players.forEach(outOfBounds);

 	updateScore(players);


 	players.forEach( function( player ){

 	for (i = 0; i < enemies.length; i++) {
 	var hit = collisionDetection(player, enemies[i])
 	// if (hit == 1) {
 	// 	//enemies.splice(i, 1);
 	// }
 }
});

 	;
 	
}

function movePlayer(player) {

	player.velocityX = Math.round(player.tiltLR*.25);
	player.velocityY = Math.round(player.tiltFB*.25);

	for (i = 0; i < players.length; i++) {
	 	for (j = 0; j < barriers.length; j++) {
	 	barrierDetectionPlayer(players[i], barriers[j]);
	 	console.log(i + "   " + j)
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
 	if (time > 0.5) {
 	if (time-enemy.hitTime > 0 && time - enemy.hitTime < 0.5) {
 		enemy.fillColor = 'white'
 	}
 	else if (enemy.hitTime >= 0.5) {
 		enemy.hitTime = 0;
 		enemy.power = 1;
 		enemy.fillColor = 'red'
 	}
 }
}

function collision(object1,object2) {

var intersect = {
	x: (object1.bounds.right + object1.velocityX >= object2.bounds.left) && (object1.bounds.left + object1.velocityX <= object2.bounds.right),
	y: (object1.bounds.bottom + object1.velocityY >= object2.bounds.top) && (object1.bounds.top + object1.velocityY <= object2.bounds.bottom)
}

	if (intersect.x && intersect.y) {
		return 1
	}
	else 
		return 0

}

function barrierDetectionPlayer(player, barrier) {


if (collision(player, barrier)) {
	
var leftCollision = (player.bounds.right+player.velocityX >= barrier.bounds.left) && (barrier.bounds.top < player.position.y) && (player.position.y < barrier.bounds.bottom) && (player.velocityX >= 0)
var rightCollision = (player.bounds.left+player.velocityX <= barrier.bounds.right) && (barrier.bounds.top < player.position.y) && (player.position.y < barrier.bounds.bottom) && (player.velocityX <= 0)

var topCollision = (player.bounds.bottom >= barrier.bounds.top)  && (barrier.bounds.left < player.position.x) && (player.position.x < barrier.bounds.right) && (player.velocityY >= 0)
var bottomCollision = (player.bounds.top <= barrier.bounds.bottom)  && (barrier.bounds.left < player.position.x) && (player.position.x < barrier.bounds.right) && (player.velocityY <= 0)

	console.log(player.velocityX);

	if (leftCollision) {
		player.velocityX = 0;
		//console.log("LEFT")
	}

	if (rightCollision) {
		player.velocityX = 0
		//console.log("RIGHT")
	}

	if (topCollision) {
		player.velocityY = 0;
		//console.log("TOP")
	}

	 if (bottomCollision) {
		player.velocityY = 0;
	 	//console.log("BOTTOM")
	 }

}

}

function barrierDetectionEnemy(player, barrier) {

if (collision(player, barrier)) {
  	player.velocityX = -(player.velocityX);
  	player.velocityY = -(player.velocityY);
}

}

function collisionDetection(player, enemy) {

if (collision(player,enemy) && enemy.power == 1) {
	damage(player, enemy)
	console.log(player.hitCounter);
	return 1
}

else {
	return 0
}

}

function damage(player,enemy) {

  	player.counter++;

  	if (enemy.color == '#0D55FF') {
  		enemy.color = '#FF0000'
	  	enemy.fillColor = enemy.color
	  	
	  	enemy.position.x = Math.random*view.size.width
	  	enemy.position.y = Math.random*view.size.height
	  	
  }
  else {
  	enemy.power = 0
  	enemy.hitTime = time;
  	player.hitCounter++
  	console.log(enemy.hitTime + "     time:" + time)
  	
  	if (player.hitCounter == 3) {
  		  for (i = 0; i < 20; i++) {

  			var playerPiece = new Path.Rectangle({
			 point: [player.position.x, player.position.y], 
			 size: [player.bounds.width/4, player.bounds.height/3],
			}); 
  			playerPiece.fillColor = player.color
  			playerPiece.velocityX = Math.random() * 8 * (Math.floor(Math.random()*5) == 1 ? 1 : -1);
			playerPiece.velocityY = Math.random() * 8 * (Math.floor(Math.random()*5) == 1 ? 1 : -1);
			playerPieces.push(playerPiece)
			console.log("EXPLOSION")
  		}
  		removePlayer(player.name)
  	}

  }

console.log(enemies.length)
  

}

function outOfBounds(square) {

 	if (square.bounds.left > view.size.width) {
		square.position.x = 0;
	}
	if (square.bounds.top > view.size.height) {
		square.position.y = -(square.bounds.height/2);
	}
	if (square.position.y < -(square.bounds.height/2)) {
		square.position.y = view.size.height+(square.bounds.height/2);
	}
	if (square.bounds.right < 0) {
		square.position.x = view.size.width+(square.bounds.width/2);
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

function updateScore(players) {

	$('#score').html('');
	for (i = 0; i < players.length; i++) {
        $('#score').append('<id="' + players[i].id + '" style="color:'+players[i].color + '">' +
        players[i].nickname +  '<br/><id="score">Consumed: ' + (players[i].counter) + '<br/><id="score">Hits: ' + (players[i].hitCounter) + '<br/><br/></span>');

	}

}

//SOCKET

socket.on('newConnection', function(data) {
   	createPlayer(data.id, data.name, data.color);
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
        console.log(participants[i].id);
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