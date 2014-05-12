function init() {
 
var serverBaseUrl = document.domain;
 
var socket = io.connect(serverBaseUrl);
 
var sessionId = ''; 
 
function listParticipants(participants) {
    $('#participants').html('');
    for (var i = 0; i < participants.length; i++) {
        $('#participants').append('<div class="square" id="' + participants[i].id + '" style="background-color:'+participants[i].color + '">' +
        participants[i].id + '
        ' + (participants[i].id === sessionId ? '(You)' : '') + '<br /></span>');
        console.log(participants[i].direction + "?????");
    }
}

socket.on('newIndex', function(data) {
  listParticipants(data.participants);
  console.log("PARTICIPANTS LOADED")
})

  socket.on('newConnection', function(data) {
    listParticipants(data.participants);
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
   console.log(data.direction + "?????");
  });

socket.on('directionChanged', function(data) {
   document.getElementById(data.id).innerHTML = data.direction;
   console.log(data.direction + "?????");
  });

}
 
$(document).on('ready', init);