function init() {

var serverBaseUrl = document.domain;

var socket = io.connect(serverBaseUrl);

var sessionId = '';	

function updateParticipants(participants) {
	$('#participants').html('');
	for (var i = 0; i < participants.length; i++) {
		$('#participants').append('<span id="' + participants[i].id + '">' +
        participants[i].id + ' ' + (participants[i].id === sessionId ? '(You)' : '') + '<br /></span>');
        // var elem = document.getElementById(participants[i].id);
        // elem.setAttribute("width: 500px; background-color: red;");
	}
}

window.ondevicemotion = function(e){
    var x = e.accelerationIncludingGravity.x;
    var y = e.accelerationIncludingGravity.y;
    var z = e.accelerationIncludingGravity.z;

    // send data over the socket
    socket.emit('acceleration', {'x':x, 'y':y, 'z':z});
}

  socket.on('connect', function () {
    sessionId = socket.socket.sessionid;
    console.log('Connected ' + sessionId);
    socket.emit('newUser', {id: sessionId});
    
     
  });

  socket.on('newConnection', function(data) {
  	updateParticipants(data.participants);
  	console.log(data.id + " has joined the server");  
  });

  socket.on('userDisconnected', function(data) {
  	$('#' + data.id).remove();
  	console.log(data.id + " has left the server");
  });

socket.on('colorChanged', function(data) {
   $('#' + data.id).css('backgroundColor', data.color);
   console.log('#' + data.id);
   console.log(data.color);
  });

function colorFocusOut() {
    //var color = $('#red').val();
    //var color = $('.color').attr("value");
    var color = $('#' + this.id).attr("value");
    //var color = this.id;
    socket.emit('colorChange', {id: sessionId, color: color});
    console.log(color);
  }

 $('.color').on('click', colorFocusOut);

}

$(document).on('ready', init);