function init() {


var serverBaseUrl = document.domain;

var socket = io.connect(serverBaseUrl);

var sessionId = ''; 

socket.on('connect', function () {
    sessionId = socket.socket.sessionid;
    console.log('Connected ' + sessionId);
    socket.emit('newUser', {id: sessionId});
    socket.emit('colorChange', {id: sessionId, color: 'green'});

 });

    //   if (window.DeviceOrientationEvent) {

    //     // Listen for the deviceorientation event and handle the raw data
    //     window.addEventListener('deviceorientation', function(eventData) {
    //       // gamma is the left-to-right tilt in degrees, where right is positive
    //       var tiltLR = eventData.gamma;
          
    //       // beta is the front-to-back tilt in degrees, where front is positive
    //       var tiltFB = eventData.beta;
          
    //       // alpha is the compass direction the device is facing in degrees
    //       var dir = eventData.alpha

    //       // call our orientation event handler
    //       deviceOrientationHandler(tiltLR, tiltFB, dir);
    //       }, false);
    //   } else {

    //   }
    // }

}

if (window.DeviceOrientationEvent) {
 console.log("DeviceOrientation is supported");
}

  window.ondeviceorientation = function(event) {

    var tiltLR = event.gamma;
    var tiltFB = event.beta;

    deviceOrientationHandler(tiltLR, tiltFB);

  }
  
  function deviceOrientationHandler(tiltLR, tiltFB) {

      var ele = document.getElementById('myCanvas');
      var con = ele.getContext('2d');

      con.fillStyle = 'black';
      con.fillRect  (0, 0, window.innerWidth, window.innerHeight);  // now fill the canvas
      var radius = 50;
      var color;

      var element = document.getElementById('myCanvas');
      var context = element.getContext('2d');

      context.fillStyle = 'yellow';
      context.beginPath();
      var circleX = (window.innerWidth/2) + (tiltLR*(window.innerWidth/2)/90);
      var circleY = (window.innerHeight/2) + (tiltFB*(window.innerHeight/2)/90);
      context.arc(circleX, circleY, radius, 0, Math.PI * 2, true);
      console.log(circleY);
      context.closePath();
      context.fill();

      var c = document.getElementById("myCanvas");
      var cty = c.getContext("2d");

      cty.font = "60px Arial";
      if (tiltFB < -45) {
        color = 'blue';
        cty.fillText(Math.round(tiltFB), window.innerWidth/2,window.innerHeight/4);
      }
      if (tiltFB > 24) {
        cty.fillText(Math.round(tiltFB),window.innerWidth/2,window.innerHeight*.75);
        color = 'red';
        socket.emit('colorChange', {id: sessionId, color: 'red'});
      }

      var ctx = c.getContext("2d");
      ctx.font = "60px Arial";

      if (tiltLR < 0){
        cty.fillText("LEFT",window.innerWidth/4,window.innerHeight/2);
      }
      if (tiltLR > 0) {
        cty.fillText("RIGHT",window.innerWidth*.75,window.innerHeight/2);
      }

  

      }
$(document).on('ready', init);