var ps;
var img;

function setup() {
  var myCanvas = createCanvas(windowWidth, 850);
  myCanvas.parent("home");
  background(0, 128, 128);
  smooth();
  noStroke();
  ps = new ParticleSystem(350);
  fill(255,100);
  img = loadImage("./banner/banner.png");
  imageMode(CENTER);
  image(img, width/2, height/2);
}

function draw() {
  background(0,128,128);
  image(img, width/2, height/2);
  ps.display(mouseX, mouseY);
}


// Particle class
function Particle(startx, starty){
  this.position = createVector(startx, starty);
  this.acceleration = p5.Vector.random2D(0.1);
  this.velocity = p5.Vector.random2D();
  this.diameter = random(3, 15);
  this.acceleration.div(this.diameter);
  this.maxspeed = 100;
  this.maxaccel = 10;
  this.magnetism = 100;
  this.drag = 0.95;

  this.update = function(x, y){
    var newloc = createVector(x, y);
    var force = p5.Vector.sub(newloc, this.position);
    var magnitude = force.mag();
    this.acceleration.set(force);
    this.acceleration.mult(this.magnetism/(magnitude*magnitude));
    this.acceleration.limit(this.maxaccel);
    this.acceleration.mult(1/sqrt(this.diameter));
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.velocity.mult(this.drag);
    this.velocity.limit(this.maxspeed);
  }

  this.display = function(){
    ellipse(this.position.x, this.position.y, this.diameter, this.diameter);
  }
}



// Particle system
function ParticleSystem(n){
  this.n = n;
  this.system = [];
  this.name_coords = [];
  this.yloc = height/2;
  this.freq = 0.05;
  this.xoff = 0.0;
  this.yoff = 0.0;
  
  // Starting position for each particle
  for(var i = 0; i < this.n; i++){
    this.system.push(new Particle(random(width), height/2 + 50));
  }
  // If mouse is in view gravitate towards mouse position
  this.display = function(x, y){
    stroke(255, 50);
    for(var i = 0; i < this.system.length; i+=10){
      for(var j = 0; j < this.system.length; j+=5){
          var x1 = this.system[i].position.x;
          var y1 = this.system[i].position.y;
          var x2 = this.system[j].position.x;
          var y2 = this.system[j].position.y;

        if(dist(x1, y1, x2, y2)< 50){
          line(x1, y1, x2, y2);
        }
      }
    }
    noStroke();
    fill(255, 100);
    if(mouseX < width - 10 & mouseX > 10 & mouseY < height - 10 & mouseY > 10){
      for(var i = 0; i < this.system.length; i++){
        this.system[i].magnetism = 500;
        this.system[i].update(x,y);
        this.system[i].display();
      }
    }
  // If mouse is not in view then migrate to random position below name
    else {
      this.xoff = this.xoff + 1;
      var x = sin(noise(this.xoff)*360)*width;
      var y = height/2 + 50;
      for(var i = 0; i < this.system.length; i++){
        this.system[i].magnetism = 100;
        this.system[i].update(x, y);
        this.system[i].display();       
      } 
    }
  }
}
