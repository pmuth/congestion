
    init();


    var count = 0;
    
    function init() {


      if (window.DeviceOrientationEvent) {
        // Listen for the deviceorientation event and handle the raw data
        window.addEventListener('deviceorientation', function(eventData) {
          // gamma is the left-to-right tilt in degrees, where right is positive
          var tiltLR = eventData.gamma;
          
          // beta is the front-to-back tilt in degrees, where front is positive
          var tiltFB = eventData.beta;
          
          // alpha is the compass direction the device is facing in degrees
          var dir = eventData.alpha
          
          // call our orientation event handler
          deviceOrientationHandler(tiltLR, tiltFB, dir);
          }, false);
      } else {
        //document.getElementById("doEvent").innerHTML = "Not supported on your device or browser.  Sorry."
      }
    }
  
    function deviceOrientationHandler(tiltLR, tiltFB, dir) {

      var colorR = Math.abs(tiltLR)*(255/90);
      var colorG = Math.abs(tiltFB)*(255/90);
      var colorB = dir*(255/360);

      var element = document.getElementById('myCanvas');
      var context = element.getContext('2d');

      context.fillStyle = 'black';
      context.fillRect  (0,   0, window.innerWidth, window.innerHeight);  // now fill the canvas
      var radius = 50;
         
         //context.fillStyle = 'rgb('+ Math.round(colorR) + ',' + Math.round(colorG) + ',' + Math.round(colorB) +')';
         context.fillStyle = 'rgb(255,0,0)';
                context.beginPath();
                var circleX = (window.innerWidth/2) + (tiltLR*(window.innerWidth/2)/90);
                var circleY = (window.innerHeight/2) + (tiltFB*(window.innerHeight/2)/90);
                //context.arc(circleX, circleY, radius, 0, Math.PI * 2, true);
                context.arc(circleX, circleY, radius, 0, Math.PI * 2, true);
                console.log(circleY);
                context.closePath();
                context.fill();

var c = document.getElementById("myCanvas");
var cty = c.getContext("2d");
cty.font = "60px Arial";
if (tiltFB < 0)
cty.fillText("UP" ,window.innerWidth/2,window.innerHeight/4);
if (tiltFB > 0)
cty.fillText("DOWN",window.innerWidth/2,window.innerHeight*.75);

var ctx = c.getContext("2d");
ctx.font = "60px Arial";

if (tiltLR < 0)
cty.fillText("LEFT" ,window.innerWidth/4,window.innerHeight/2);
if (tiltLR > 0)
cty.fillText("RIGHT",window.innerWidth*.75,window.innerHeight/2);



    }