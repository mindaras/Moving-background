const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let objects = []; // array to store the objects

// object constructor
function Object(x, y, radius, color) {
  // create random shapes
  if (Math.random() > 0.5) {
    this.shape = "circle";
    this.radius = radius;
  } else if (Math.random() > 0.5) {
    this.shape = "square";
    this.size = radius * 2;
  } else {
    this.shape = "triangle";
    this.size = radius * 2;
  }

  this.x = x;
  this.y = y;
  this.color = color;
  this.velocity = {
    x: (Math.random() - 0.5) * 2.5,
    y: (Math.random() - 0.5) * 2.5,
  };
  this.initialVelocity = {
    x: this.velocity.x,
    y: this.velocity.y,
  };
}

// draw the object on the canvas
Object.prototype.draw = function () {
  if (this.shape === "circle") {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  } else if (this.shape === "square") {
    ctx.beginPath();
    ctx.rect(
      this.x - this.size / 2,
      this.y - this.size / 2,
      this.size,
      this.size
    );
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  } else if (this.shape === "triangle") {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y - this.size / 2);
    ctx.lineTo(this.x - this.size / 2, this.y + this.size / 2);
    ctx.lineTo(this.x + this.size / 2, this.y + this.size / 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
};

// update the object's position
Object.prototype.update = function () {
  this.x += this.velocity.x;
  this.y += this.velocity.y;

  // bounce off the walls
  if (this.shape === "circle") {
    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
      this.velocity.x = -this.velocity.x;
    }
    if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
      this.velocity.y = -this.velocity.y;
    }
  } else {
    if (this.x + this.size / 2 > canvas.width || this.x - this.size / 2 < 0) {
      this.velocity.x = -this.velocity.x;
    }
    if (this.y + this.size / 2 > canvas.height || this.y - this.size / 2 < 0) {
      this.velocity.y = -this.velocity.y;
    }
  }

  // bounce off the mouse cursor
  let dx, dy, distance, force;
  if (this.shape === "circle") {
    dx = mouse.x - this.x;
    dy = mouse.y - this.y;
    distance = Math.sqrt(dx * dx + dy * dy);
  } else if (this.shape === "square") {
    dx = mouse.x - (this.x + this.size / 2);
    dy = mouse.y - (this.y + this.size / 2);
    distance = Math.sqrt(dx * dx + dy * dy);
  } else if (this.shape === "triangle") {
    dx = mouse.x - (this.x + this.size / 2);
    dy = mouse.y - (this.y + this.size / 2);
    distance = Math.sqrt(dx * dx + dy * dy);
  }
  if (this.shape === "circle") {
    if (distance < mouse.radius + this.radius) {
      // calculate the force of the collision
      force = ((mouse.radius + this.radius - distance) / distance) * 0.01; // reduce the force
      // apply the force to the velocity
      this.velocity.x += dx * force;
      this.velocity.y += dy * force;
      // gradually slow down the object if the velocity is greater than the initial velocity
      if (Math.abs(this.velocity.x) > Math.abs(this.initialVelocity.x)) {
        this.velocity.x *= 0.99;
      }
      if (Math.abs(this.velocity.y) > Math.abs(this.initialVelocity.y)) {
        this.velocity.y *= 0.99;
      }
    }
  } else {
    if (distance < mouse.radius + this.size / 2) {
      // calculate the force of the collision
      force = ((mouse.radius + this.size / 2 - distance) / distance) * 0.1;
      // apply the force to the velocity
      this.velocity.x -= dx * force; // always apply the force in the opposite direction of the mouse cursor
      this.velocity.y -= dy * force; // always apply the force in the opposite direction of the mouse cursor
    }

    // gradually slow down the object if the velocity is greater than the initial velocity
    if (Math.abs(this.velocity.x) > Math.abs(this.initialVelocity.x)) {
      this.velocity.x *= 0.99;
    }
    if (Math.abs(this.velocity.y) > Math.abs(this.initialVelocity.y)) {
      this.velocity.y *= 0.99;
    }
  }

  // draw the object
  this.draw();
};

// create the objects and push them to the array
for (let i = 0; i < 50; i++) {
  const radius = Math.random() * 50;
  const x = Math.random() * (canvas.width - radius * 2) + radius;
  const y = Math.random() * (canvas.height - radius * 2) + radius;
  const color = "#" + Math.floor(Math.random() * 16777215).toString(16);
  objects.push(new Object(x, y, radius, color));
}

// mouse object
const mouse = {
  x: null,
  y: null,
  radius: 100,
};

// track the mouse's position
window.addEventListener("mousemove", (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});

// animate the objects
function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < objects.length; i++) {
    objects[i].update();
  }
}

animate();
