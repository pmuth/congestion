
var serverBaseUrl = document.domain;

var socket = io.connect(serverBaseUrl);

var sessionId = ''; 

//var color
//var name

$( document ).ready(function() {
    $('#controller').hide();
    $('.square').hide();
    $('#color').hide();

      $('.button').on('click', name);
});

function name() {

  var name = $('.textName').val();

  $('#name').hide();
  $('.button').hide();
  $('.textName').hide();

  $('#colors').append("<div class='title' id='color'>SELECT A COLOR</div>")
  $('#colors').append("<div class='square' style='background-color:#7919FF'></div>");
  $('#colors').append("<div class='square' style='background-color:#00FF3E'></div>");
  $('#colors').append("<div class='square' style='background-color:#CC7C14'></div>");
  $('#colors').append("<div class='square' style='background-color:#B28C5A'></div>");

   $('.square').on('click', color);

}


function color() {

  $('#colors').hide();

  $('#controller').show();

  var color = $( this ).css("background-color");

  sessionId = socket.socket.sessionid;
  socket.emit('newUser', {id: sessionId, name: name, color: color});
  start(name, color); 

}


function start(name, color) {

if (window.DeviceOrientationEvent) {

    console.log(name + "    " + color)

        // Listen for the deviceorientation event and handle the raw data
        window.addEventListener('deviceorientation', function(eventData) {
          // gamma is the left-to-right tilt in degrees, where right is positive
          var tiltLR = Math.round(eventData.gamma);
          
          // beta is the front-to-back tilt in degrees, where front is positive
          var tiltFB = Math.round(eventData.beta);
          
          // alpha is the compass direction the device is facing in degrees
          var dir = Math.round(eventData.alpha);

          // call our orientation event handler
          deviceOrientationHandler(tiltLR, tiltFB, dir, color);
          }, false);

      } 
    }
//    }
  
  function deviceOrientationHandler(tiltLR, tiltFB, dir, color) {

      var ele = document.getElementById('controller');
      var con = ele.getContext('2d');

      con.fillStyle = 'black';
      con.fillRect  (0, 0, window.innerWidth, window.innerHeight);  // now fill the canvas
      var radius = 50;
      var color;
      var direction;

      var element = document.getElementById('controller');
      var context = element.getContext('2d');

      context.fillStyle = color;
      context.beginPath();
      var circleX = (window.innerWidth/2) + (tiltLR*(window.innerWidth/2)/90);
      var circleY = (window.innerHeight/2) + (tiltFB*(window.innerHeight/2)/90);
      context.arc(circleX, circleY, radius, 0, Math.PI * 2, true);
      console.log(circleY);
      context.closePath();
      context.fill();

      var c = document.getElementById("controller");
      var cty = c.getContext("2d");

      cty.font = "60px Arial";
      socket.emit('directionChange', {id: sessionId, tiltLR: tiltLR, tiltFB: tiltFB});

      }

      // function name() {

//   var name = $( '.textName' ).val();

//   $('#name').hide();
//   $('.button').hide();
//   $('.textName').hide();

//   $('.square').show();
//   $('#color').show();

 

// }
