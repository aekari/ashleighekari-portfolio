document.addEventListener("DOMContentLoaded", function () {
    const abstractBg = document.querySelector(".abstract-bg");
    const maxSquares = 20;
    const squares = [];
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    const repelRadius = 80;
    const calmDownFactor = 0.98;
    const revealText = document.querySelector(".description");
  
    function createSquare() {
      const square = document.createElement("div");
      square.classList.add("shape");
  
      const posX = Math.random() * window.innerWidth;
      const posY = Math.random() * window.innerHeight;
  
      square.style.left = `${posX}px`;
      square.style.top = `${posY}px`;
  
      abstractBg.appendChild(square);
      squares.push({
        element: square,
        speedX: (Math.random() - 0.5) * 1.5,
        speedY: (Math.random() - 0.5) * 1.5
      });
    }
  
    // Create exactly 20 squares
    for (let i = 0; i < maxSquares; i++) {
      createSquare();
    }
  
    function moveSquares() {
      squares.forEach((squareData) => {
        const square = squareData.element;
  
        let posX = parseFloat(square.style.left);
        let posY = parseFloat(square.style.top);
  
        posX += squareData.speedX;
        posY += squareData.speedY;
  
        if (
          posX < -50 ||
          posX > window.innerWidth ||
          posY < -50 ||
          posY > window.innerHeight
        ) {
          const centerX = window.innerWidth / 2;
          const centerY = window.innerHeight / 2;
          const angleToCenter = Math.atan2(centerY - posY, centerX - posX);
          squareData.speedX = Math.cos(angleToCenter) * 2.5;
          squareData.speedY = Math.sin(angleToCenter) * 2.5;
        }
  
        posX = Math.max(0, Math.min(posX, window.innerWidth - 45));
        posY = Math.max(0, Math.min(posY, window.innerHeight - 45));
  
        squareData.speedX *= calmDownFactor;
        squareData.speedY *= calmDownFactor;
  
        square.style.left = `${posX}px`;
        square.style.top = `${posY}px`;
      });
  
      requestAnimationFrame(moveSquares);
    }
  
    moveSquares();
  
    // Mouse interaction for CMY paintbrush effect and reveal text effect
    window.addEventListener("mousemove", function (event) {
      mouseX = event.clientX;
      mouseY = event.clientY;
      createPaintStroke(mouseX, mouseY);
  
      // Calculate distance from mouse to text to reveal it
      const rect = revealText.getBoundingClientRect();
      const textX = rect.left + rect.width / 2;
      const textY = rect.top + rect.height / 2;
      const distX = mouseX - textX;
      const distY = mouseY - textY;
      const distanceToText = Math.sqrt(distX * distX + distY * distY);
  
      // If within a certain distance, reveal the text
      if (distanceToText < 150) {
        revealText.classList.add("revealed");
      } else {
        revealText.classList.remove("revealed");
      }
    });
  
    function createPaintStroke(x, y) {
      const stroke = document.createElement("div");
      stroke.className = "cmy-round-stroke";
      stroke.style.left = `${x - 80}px`;
      stroke.style.top = `${y - 80}px`;
      abstractBg.appendChild(stroke);
  
      squares.forEach((squareData) => {
        const square = squareData.element;
        const squareX = parseFloat(square.style.left);
        const squareY = parseFloat(square.style.top);
  
        const distX = squareX - x;
        const distY = squareY - y;
        const distance = Math.sqrt(distX * distX + distY * distY);
  
        if (distance < repelRadius) {
          const angle = Math.atan2(distY, distX);
          squareData.speedX += Math.cos(angle) * 2;
          squareData.speedY += Math.sin(angle) * 2;
        }
      });
  
      setTimeout(() => {
        stroke.style.opacity = "0";
        stroke.style.transform = "scale(0.5)";
        setTimeout(() => {
          stroke.remove();
        }, 500);
      }, 300);
    }
  });
  