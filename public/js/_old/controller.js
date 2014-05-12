function init() {

var serverBaseUrl = document.domain;

var socket = io.connect(serverBaseUrl);

var sessionId = '';	

  socket.on('connect', function () {
    sessionId = socket.socket.sessionid;
    console.log('Connected ' + sessionId);
    socket.emit('newUser', {id: sessionId});
     
  });

function colorFocusOut() {
    var color = $( this ).css( "background-color" );
    var direction = $(this).attr("id");
    socket.emit('colorChange', {id: sessionId, color: color});
    socket.emit('directionChange', {id: sessionId, direction: direction});
    console.log(color);
  }

 $('.square').on('click', colorFocusOut);

}

$(document).on('ready', init);