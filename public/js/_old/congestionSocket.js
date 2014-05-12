

//function init() {
 
var serverBaseUrl = document.domain;
 
var socket = io.connect(serverBaseUrl);
 
var sessionId = ''; 


 
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

var direction="up";
var tiltLR = 0;
var tiltFB = 0;

var
squares = [],
i = 0,
jimbo

var middle = new Point(440, 440);
var playerOne = new Path.Rectangle(middle, 35); 
playerOne.fillColor = 'yellow';
playerOne.fillColor.alpha = 1.0;
		playerOne.velocityX = 0;
 		playerOne.velocityY = 0;

function changeDirection(square) {
	 //console.log(direction);
	 switch(direction) {

	 	case "left": 

 		square.velocityX = -3;
 		square.velocityY = 0;
 		console.log("L");
 		break;
 	
		case "right":

 		square.velocityX = 3;
 		square.velocityY = 0;
 		break;
 	
 		case "up":

		square.velocityX = 0;
 		square.velocityY = -3;
 		break;
 	
 		case "down":

		square.velocityX = 0;
 		square.velocityY = 3;
 		break;
 	}	
}

function moveSquare(square) {

	square.velocityX = tiltLR*.25;
	square.velocityY = tiltFB*.25;

}



for( i = 0; i < 100; i ++ ){

	var point = new Point.random();
	point.x = point.x*900;
	point.y = point.y*900;
	//console.log(point);
	var square = new Path.Rectangle( point, 20 )
	square.fillColor = 'purple'

	square.velocityX = Math.random() * 3;
	square.velocityX *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
	square.velocityY = Math.random() * 3;
	square.velocityY *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
	squares.push( square )
}

console.log("YES?");




function onFrame( event ){

	 // Let's loop through our squares array
	 // and move each one towards its destination.	
	 // If it's close to its destination, we'll pick a new destination.

	playerOne.position.x += playerOne.velocityX;
	playerOne.position.y += playerOne.velocityY;

	squares.forEach( function( square ){

 		square.position.x += square.velocityX;
 		square.position.y += square.velocityY;


outOfBounds(square);


 	})

 	outOfBounds(playerOne);
	moveSquare(playerOne);
	playerOne.fillColor = 'yellow';
 }
var tool = new Tool();
 function onKeyDown( event ) {

 	if (event.key =='left') {

 		playerOne.velocityX = -3;
 		playerOne.velocityY = 0;
 	}

 	 if (event.key =='right') {

 		playerOne.velocityX = 3;
 		playerOne.velocityY = 0;

 	}

 	if (event.key =='up') {

		playerOne.velocityX = 0;
 		playerOne.velocityY = -3;

 	}

 	if (event.key =='down') {

		playerOne.velocityX = 0;
 		playerOne.velocityY = 3;

 	}

 }

function outOfBounds(square) {

 		if (square.bounds.left > view.size.width) {
			//square.position.x = -square.bounds.width;
			square.position.x = 0;
			//square.fillColor = 'red';

		}

		if (square.bounds.top > view.size.height) {

			square.position.y = -10;
			//square.fillColor = 'blue';
		}

		if (square.position.y < -10) {
			square.position.y = view.size.height+10;
					//square.fillColor = 'green';
		}

		if (square.bounds.right < 0) {
			square.position.x = view.size.width+10;
				//square.fillColor = 'orange';

		}



}

  socket.on('newConnection', function(data) {
    //listParticipants(data.participants);
    console.log(data.id + " has joined the server");  
  });
 
  socket.on('userDisconnected', function(data) {
    $('#' + data.id).remove();
    console.log(data.id + " has left the server");
  });
 
socket.on('colorChanged', function(data) {
   $('#' + data.id).css('backgroundColor', data.color);
   // console.log('#' + data.id);
   // console.log(data.color);
  });

socket.on('directionChanged', function(data) {
	tiltLR = data.tiltLR;
	tiltFB = data.tiltFB;
	//console.log(playerOne);
	//changeDirection(playerOne);

  });




