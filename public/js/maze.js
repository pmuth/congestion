var serverBaseUrl = document.domain;
 
var socket = io.connect(serverBaseUrl);
 
var sessionId = ''; 

var enemies = []
var players = []
var barriers = []
var maze = []

var playerPieces = []

var goodCounter = 0;
var hitCounter = 0;
var time

//createEnemies();
//createBarriers();
createMaze();
createFinish();

function createPlayer(id, name, color) {

	var playerSize = {
		x: 20,
		y: 20
	}

	var point = new Point();
		point.x = Math.random()*20+(playerSize.x/2+15);
		point.y = Math.random()*20+(playerSize.y/2+15);	
	
	// var player = new Path.Rectangle({
	// 	point: [point.x, point.y],
	// 	size: [playerSize.x, playerSize.y],
	// 	fillColor: color
	// }) 

	var player = new Path.Circle({
		center: [point.x, point.y],
		radius: playerSize.x/2,
		fillColor: color
	});

	player.name = id;
	player.color = color;
	player.nickname = name;
	player.tiltLR = 0;
	player.tiltFB = 0;
	player.counter = 0;
	player.hitCounter = 0;
	player.finishTime = 0;
	player.notFinished = true;
	player.birthTime = time;
	player.currentTime = time;
	players.push(player);

}

function onFrame( event ){
	time = event.time;

	// enemies.forEach(moveEnemy);
	//enemies.forEach(outOfBounds);

	// playerPieces.forEach(moveEnemy);

 	players.forEach(movePlayer);
 	players.forEach(outOfBounds);

 	updateScore(players);


 	players.forEach( function( player ){

 // 	for (i = 0; i < enemies.length; i++) {
 // 	var hit = collisionDetection(player, enemies[i])
 // 	// if (hit == 1) {
 // 	// 	//enemies.splice(i, 1);
 // 	// }
 // }
});

 	//console.log(event.delta);
 	
}



function movePlayer(player) {

if (player.notFinished){

	player.velocityX = Math.round(player.tiltLR*.15);
	player.velocityY = Math.round(player.tiltFB*.15);

	for (i = 0; i < players.length; i++) {
	 	for (j = 0; j < maze.length; j++) {
	 	barrierDetectionPlayer(players[i], maze[j]);	
	 }

	}
	 player.position.x += player.velocityX;
	 player.position.y += player.velocityY;

	 player.currentTime = time-player.birthTime;
}
}

function barrierDetectionPlayer(player, barrier) {

var intersect = {
	x: (player.bounds.right + player.velocityX >= barrier.bounds.left) && (player.bounds.left + player.velocityX <= barrier.bounds.right),
	y: (player.bounds.bottom + player.velocityY >= barrier.bounds.top) && (player.bounds.top + player.velocityY <= barrier.bounds.bottom)
}

if (intersect.x && intersect.y) {
	
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

function outOfBounds(square) {
//UNCONTAINED

    //	if (square.bounds.left > view.size.width) {
	// 	square.bounds.right = 0;
	// }
	// if (square.bounds.top > view.size.height) {
	// 	square.bounds.bottom = 0;
	// }
	// if (square.bounds.bottom < 0) {
	// 	square.bounds.top = view.size.height;
	// }
	// if (square.bounds.right < 0) {
	// 	square.bounds.left = view.size.width;
	// }


//CONTAINED SCREEN

	//LEFT
	if (square.bounds.left <= 0 && square.velocityX < 0) {
		square.position.x = square.bounds.width/2

	}
	//RIGHT
	// if (square.bounds.right > view.size.width && square.velocityX > 0) {
	// 	square.position.x = view.size.width - square.bounds.width /2;
	// }

	//TOP
	if (square.bounds.top <= 0) {
		square.position.y = square.bounds.height/2;
	}

	//BOTTOM
	if (square.bounds.bottom > view.size.height) {
		square.position.y = view.size.height-square.bounds.height/2;
	} 


	if (square.bounds.left > view.size.width) {

		square.position.y = view.size.width+20;
		square.finishTime = square.currentTime;
		square.notFinished = false;
		console.log("FINISH");
	}

}

function removePlayer(id) {

for (i = 0; i < players.length; i++) {

	if (players[i].name == id) {		
		console.log(players[i]);
		var name = players[i].nickname;
		players[i].remove();
		players.length;
		players.splice(i, 1);
	}	

}
    console.log(players.length);
    console.log(id + " has left the server");

}

function createFinish(player) {

//CREATE FINISH LINE
var pointFinish = new Point();
	pointFinish.x = 700;
	pointFinish.y = 15;

var sizeFinish = {
	x: 12.5,
	y: 12.5
}


for (i = 0; i < 4; i++) {

var finish1 = new Path.Rectangle({
		point: [pointFinish.x+(i*25), pointFinish.y+12.5],
		size: [sizeFinish.x, sizeFinish.y],
		fillColor: 'white'
	});

var finish2 = new Path.Rectangle({
		point: [pointFinish.x+12.5+(i*25), pointFinish.y],
		size: [sizeFinish.x, sizeFinish.y],
		fillColor: 'white'
	});

var finish1 = new Path.Rectangle({
		point: [pointFinish.x+(i*25), pointFinish.y+(12.5*3)],
		size: [sizeFinish.x, sizeFinish.y],
		fillColor: 'white'
	});

var finish2 = new Path.Rectangle({
		point: [pointFinish.x+12.5+(i*25), pointFinish.y+(12.5*2)],
		size: [sizeFinish.x, sizeFinish.y],
		fillColor: 'white'
	});


}

}

function updateScore(players) {

	$('#score').html('');
	for (i = 0; i < players.length; i++) {
        $('#score').append('<id="' + players[i].id + '" style="color:'+players[i].color + '">' +
        players[i].nickname +  '<br/><id="score">Time: ' + Number((players[i].currentTime).toFixed(2)) + '<br/><br/></span>');


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
        console.log(participants[i].direction + "?????");
    }
}

socket.on('newIndex', function(data) {
  listParticipants(data.participants);
  console.log("PARTICIPANTS LOADED")
})

function createBarriers() {
	var barrierSize = {
		x: 15,
		y: 500
	}

	var point = new Point(100, 100);
	var barrier = new Path.Rectangle(point, [barrierSize.x, barrierSize.y]);
	barrier.fillColor = '#0DFF30';
	barrier.width = barrierSize.x;
	barrier.height = barrierSize.y
	barriers.push(barrier);
	
	var barrierSize2 = {x: 500, y:15}
	var point2 = new Point(115, 100);
	var barrier2 = new Path.Rectangle(point2, [barrierSize2.x, barrierSize2.y]);
	barrier2.fillColor = '#C3E80C'
	barrier2.width = barrierSize2.x;
	barrier2.height = barrierSize2.y
	barriers.push(barrier2);
	var barrierSize3 = {x: 15, y:300}
	var point3 = new Point(615, 100);
	var barrier3 = new Path.Rectangle(point3, [barrierSize3.x, barrierSize3.y]);
	barrier3.fillColor = '#FFC100'
	barrier3.width = barrierSize3.x;
	barrier3.height = barrierSize3.y
	barriers.push(barrier3);
	var barrierSize4 = {x: 400, y:15}
	var point4 = new Point(215, 385);
	var barrier4 = new Path.Rectangle(point4, [barrierSize4.x, barrierSize4.y]);
	barrier4.fillColor = '#E8660C'
	barrier4.width = barrierSize4.x;
	barrier4.height = barrierSize4.y
	barriers.push(barrier4); 
	console.log(barriers.length);
}

function createMaze() {
	
	//BOUNDS
	var mazeColor = '#12B239';
	var mazeSize01 = {x: 15,y: 800}
	var mazePoint01 = {x: 0, y:0}
	var maze01 = new Path.Rectangle(mazePoint01, [mazeSize01.x, mazeSize01.y]);
	maze01.fillColor = mazeColor
	maze.push(maze01);

	var mazeSize02 = {x: 785,y: 15}
	var mazePoint02 = {x: 15, y:0}
	var maze02 = new Path.Rectangle(mazePoint02, [mazeSize02.x, mazeSize02.y]);
	maze02.fillColor = mazeColor
	maze.push(maze02);

	var mazeSize03 = {x: 15,y: 735}
	var mazePoint03 = {x: 785, y:65}
	var maze03 = new Path.Rectangle(mazePoint03, [mazeSize03.x, mazeSize03.y]);
	maze03.fillColor = mazeColor
	maze.push(maze03);

	var mazeSize04 = {x: 770,y: 15}
	var mazePoint04 = {x: 15, y:785}
	var maze04 = new Path.Rectangle(mazePoint04, [mazeSize04.x, mazeSize04.y]);
	maze04.fillColor = mazeColor
	maze.push(maze04);


	//MAZE 
	var mazePoint05 = {x: 160, y:0}
	var mazeSize05 = {x: 15,y: 120}
	var maze05 = new Path.Rectangle(mazePoint05, [mazeSize05.x, mazeSize05.y]);
	maze05.fillColor = mazeColor
	maze.push(maze05);

	var mazePoint06 = {x: 160, y:160}
	var mazeSize06 = {x: 15,y: 280}
	var maze06 = new Path.Rectangle(mazePoint06, [mazeSize06.x, mazeSize06.y]);
	maze06.fillColor = mazeColor
	maze.push(maze06);

	var mazePoint07 = {x: 100, y:440}
	var mazeSize07 = {x: 75,y: 15}
	var maze07 = new Path.Rectangle(mazePoint07, [mazeSize07.x, mazeSize07.y]);
	maze07.fillColor = mazeColor
	maze.push(maze07);

	var mazePoint08 = {x: 120, y:455}
	var mazeSize08 = {x: 15,y: 45}
	var maze08 = new Path.Rectangle(mazePoint08, [mazeSize08.x, mazeSize08.y]);
	maze08.fillColor = mazeColor
	maze.push(maze08);

	var mazePoint09 = {x: 100, y:200}
	var mazeSize09 = {x: 160,y: 15}
	var maze09 = new Path.Rectangle(mazePoint09, [mazeSize09.x, mazeSize09.y]);
	maze09.fillColor = mazeColor
	maze.push(maze09);

	var mazePoint10 = {x: 260, y:15}
	var mazeSize10 = {x: 15,y: 200}
	var maze10 = new Path.Rectangle(mazePoint10, [mazeSize10.x, mazeSize10.y]);
	maze10.fillColor = mazeColor
	maze.push(maze10);

	var mazePoint12 = {x: 15, y:540}
	var mazeSize12 = {x: 140,y: 15}
	var maze12 = new Path.Rectangle(mazePoint12, [mazeSize12.x, mazeSize12.y]);
	maze12.fillColor = mazeColor
	maze.push(maze12);

	var mazePoint11 = {x: 140, y:555}
	var mazeSize11 = {x: 15,y: 115}
	var maze11 = new Path.Rectangle(mazePoint11, [mazeSize11.x, mazeSize11.y]);
	maze11.fillColor = mazeColor
	maze.push(maze11);

	var mazePoint13 = {x: 260, y:270}
	var mazeSize13 = {x: 15,y: 200}
	var maze13 = new Path.Rectangle(mazePoint13, [mazeSize13.x, mazeSize13.y]);
	maze13.fillColor = mazeColor
	maze.push(maze13);

	var mazePoint14 = {x: 260, y:470}
	var mazeSize14 = {x: 15,y: 240}
	var maze14 = new Path.Rectangle(mazePoint14, [mazeSize14.x, mazeSize14.y]);
	maze14.fillColor = mazeColor
	maze.push(maze14);

	var mazePoint14a = {x: 140, y:710}
	var mazeSize14a = {x: 135,y: 15}
	var maze14a = new Path.Rectangle(mazePoint14a, [mazeSize14a.x, mazeSize14a.y]);
	maze14a.fillColor = mazeColor
	maze.push(maze14a);

	var mazePoint15 = {x: 260, y:670}
	var mazeSize15 = {x: 480,y: 15}
	var maze15 = new Path.Rectangle(mazePoint15, [mazeSize15.x, mazeSize15.y]);
	maze15.fillColor = mazeColor
	maze.push(maze15);

	var mazePoint16 = {x: 260, y:550}
	var mazeSize16 = {x: 90,y: 15}
	var maze16 = new Path.Rectangle(mazePoint16, [mazeSize16.x, mazeSize16.y]);
	maze16.fillColor = mazeColor
	maze.push(maze16);

	var mazePoint17 = {x: 260, y:320}
	var mazeSize17 = {x: 210,y: 15}
	var maze17 = new Path.Rectangle(mazePoint17, [mazeSize17.x, mazeSize17.y]);
	maze17.fillColor = mazeColor
	maze.push(maze17);

	var mazePoint18 = {x: 260, y:140}
	var mazeSize18 = {x: 60,y: 15}
	var maze18 = new Path.Rectangle(mazePoint18, [mazeSize18.x, mazeSize18.y]);
	maze18.fillColor = mazeColor
	maze.push(maze18);

	var mazePoint18 = {x: 400, y:140}
	var mazeSize18 = {x: 100,y: 15}
	var maze18 = new Path.Rectangle(mazePoint18, [mazeSize18.x, mazeSize18.y]);
	maze18.fillColor = mazeColor
	maze.push(maze18);

	var mazePoint20 = {x: 420, y:15}
	var mazeSize20 = {x: 15,y: 240}
	var maze20 = new Path.Rectangle(mazePoint20, [mazeSize20.x, mazeSize20.y]);
	maze20.fillColor = mazeColor
	maze.push(maze20);

		var mazePoint20a = {x: 370, y:240}
	var mazeSize20a = {x: 50,y: 15}
	var maze20a = new Path.Rectangle(mazePoint20a, [mazeSize20a.x, mazeSize20a.y]);
	maze20a.fillColor = mazeColor
	maze.push(maze20a);

	var mazePoint21 = {x: 360, y:240}
	var mazeSize21 = {x: 15,y: 180}
	var maze21 = new Path.Rectangle(mazePoint21, [mazeSize21.x, mazeSize21.y]);
	maze21.fillColor = mazeColor
	maze.push(maze21);

	var mazePoint19 = {x: 580, y:140}
	var mazeSize19 = {x: 160,y: 15}
	var maze19 = new Path.Rectangle(mazePoint19, [mazeSize19.x, mazeSize19.y]);
	maze19.fillColor = mazeColor
	maze.push(maze19);

	var mazePoint22 = {x: 500, y:300}
	var mazeSize22 = {x: 15,y: 280}
	var maze22 = new Path.Rectangle(mazePoint22, [mazeSize22.x, mazeSize22.y]);
	maze22.fillColor = mazeColor
	maze.push(maze22);

	var mazePoint23 = {x: 440, y:450}
	var mazeSize23 = {x: 215,y: 15}
	var maze23 = new Path.Rectangle(mazePoint23, [mazeSize23.x, mazeSize23.y]);
	maze23.fillColor = mazeColor
	maze.push(maze23);

	var mazePoint23a = {x: 440, y:450}
	var mazeSize23a = {x: 15,y: 150}
	var maze23a = new Path.Rectangle(mazePoint23a, [mazeSize23a.x, mazeSize23a.y]);
	maze23a.fillColor = mazeColor
	maze.push(maze23a);

	var mazePoint24 = {x: 340, y:640}
	var mazeSize24 = {x: 15,y: 100}
	var maze24 = new Path.Rectangle(mazePoint24, [mazeSize24.x, mazeSize24.y]);
	maze24.fillColor = mazeColor
	maze.push(maze24);

	var mazePoint25 = {x: 340, y:740}
	var mazeSize25 = {x: 200,y: 15}
	var maze25 = new Path.Rectangle(mazePoint25, [mazeSize25.x, mazeSize25.y]);
	maze25.fillColor = mazeColor
	maze.push(maze25);

		var mazePoint26 = {x: 610, y:140}
	var mazeSize26 = {x: 15,y: 320}
	var maze26 = new Path.Rectangle(mazePoint26, [mazeSize26.x, mazeSize26.y]);
	maze26.fillColor = mazeColor
	maze.push(maze26);


		var mazePoint27 = {x: 580, y:580}
	var mazeSize27 = {x: 250,y: 15}
	var maze27 = new Path.Rectangle(mazePoint27, [mazeSize27.x, mazeSize27.y]);
	maze27.fillColor = mazeColor
	maze.push(maze27);

			var mazePoint28 = {x: 580, y:370}
	var mazeSize28 = {x: 160,y: 15}
	var maze28 = new Path.Rectangle(mazePoint28, [mazeSize28.x, mazeSize28.y]);
	maze28.fillColor = mazeColor
	maze.push(maze28);

				var mazePoint29 = {x: 680, y:240}
	var mazeSize29 = {x: 110,y: 15}
	var maze29 = new Path.Rectangle(mazePoint29, [mazeSize29.x, mazeSize29.y]);
	maze29.fillColor = mazeColor
	maze.push(maze29);

	var mazePoint30 = {x: 15, y:290}
	var mazeSize30 = {x: 110,y: 15}
	var maze30 = new Path.Rectangle(mazePoint30, [mazeSize30.x, mazeSize30.y]);
	maze30.fillColor = mazeColor
	maze.push(maze30);

		var mazePoint31 = {x: 60, y:540}
	var mazeSize31 = {x: 15,y: 100}
	var maze31 = new Path.Rectangle(mazePoint31, [mazeSize31.x, mazeSize31.y]);
	maze31.fillColor = mazeColor
		maze.push(maze31);

		var mazePoint32 = {x: 100, y:370}
	var mazeSize32 = {x: 110,y: 15}
	var maze32 = new Path.Rectangle(mazePoint32, [mazeSize32.x, mazeSize32.y]);
	maze32.fillColor = mazeColor
	maze.push(maze32);

	var mazePoint33 = {x: 650, y: 65}
	var mazeSize33 = {x: 150, y: 15}
	var maze33 = new Path.Rectangle(mazePoint33, [mazeSize33.x, mazeSize33.y]);
	maze33.fillColor = mazeColor
	maze.push(maze33);

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

// function barrierDetectionPlayer(player, barrier) {

//   var collisionLimit = {
//   	x: player.bounds.width/2 + barrier.bounds.width/2,
//   	y: player.bounds.height/2 + barrier.bounds.height/2
//   }

//   var distance = {
//   	x: player.position.x-barrier.position.x,
//   	y: player.position.y-barrier.position.y
//   }
//   var pushBack = {
//   	x: 0, 
//   	Y: 0
//   }

//   if ((Math.abs(distance.x) <= collisionLimit.x) && (Math.abs(distance.y) <= collisionLimit.y)) {


//   	player.fillColor = 'red'

//   	//LEFT COLLISION
//   	if (distance.x < 0 && player.velocityX > 0) {
//   		//pushBack.x = 10;
//   		player.velocityX = 0;
//   		// console.log("STUCK1")
//   	} 

//   	//RIGHT COLLISION
//   	if (distance.x > 0 && player.velocityX < 0)  {
//   		//pushBack.x = -10;
//   		player.velocityX = 0;
//   		// console.log("STUCK2")
//   		}

//   	// //TOP COLLISION
//   	// if (distance.y < 0 && player.velocityY > 0) {
//   	// 	//pushBack.y = 10;
//   	// 	player.velocityY = 0;
//   	// 	// console.log("STUCK3")
//   	// } 

//   	//BOTTOM COLLISION
//   	if (distance.y > 0  && player.velocityY < 0){
//   		//pushBack.y = -10;
//   		player.velocityY = 0;
//   		// console.log("STUCK4")
//   	}

//   	//player.position.x += pushBack.x;
//   	//player.position.y += pushBack.y;

//   }

//   else {

//   	player.fillColor = 'blue'

//   }

//   //console.log("X:" + player.velocityX + "   Y:" + player.velocityY)

// }

function barrierDetectionEnemy(square, barrier) {

 var collisionLimit = {
  	x: square.bounds.width/2 + barrier.bounds.width/2,
  	y: square.bounds.height/2 + barrier.bounds.height/2
  }

  var distDifference = {
  	x: square.position.x-barrier.position.x,
  	y: square.position.y-barrier.position.y
  }

  if ((Math.abs(distDifference.x) <= collisionLimit.x) && (Math.abs(distDifference.y) <= collisionLimit.y)) {

  	if (distDifference.x < 0) 
  		square.velocityX = -(square.velocityX);
  	if (distDifference.y < 0)
  		square.velocityY = -(square.velocityY);

  }

}

function collisionDetection(player, enemy) {

 var collisionLimit = {
  	x: player.bounds.width/2 + enemy.bounds.width/2,
  	y: player.bounds.height/2 + enemy.bounds.height/2
  }

  var distDifference = {
  	x: player.position.x-enemy.position.x,
  	y: player.position.y-enemy.position.y
  }

  if ((Math.abs(distDifference.x) <= collisionLimit.x) && (Math.abs(distDifference.y) <= collisionLimit.y) && enemy.power == 1) {
  	//damage(player, enemy);

   	return 1

  }

  return 0

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
			console.log(i)

  		}
  		removePlayer(player.name)
  	}

  }

console.log(enemies.length)
  

}


function moveEnemy(enemy) {
 		
 	for (j = 0; j < maze.length; j++) {
	 	barrierDetectionEnemy(enemy, maze[j]);
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

function createEnemies() {

var numEnemies = 125;

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
	//console.log(enemy.polarity)
}

}