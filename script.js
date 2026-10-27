let counter = 0;
setInterval(function () {
  counter++;
  let logo = document.getElementById("logo");
  if (logo.classList.contains("red")) {
    logo.classList.remove("red");
    logo.classList.add("blue");
  } else if (logo.classList.contains("blue")) {
    logo.classList.remove("blue");
    logo.classList.add("green");
  } else if (logo.classList.contains("green")) {
    logo.classList.remove("green");
    logo.classList.add("red");
  } else {
    logo.classList.add("red");
  }
}, 1000);

const docWidth = document.documentElement.clientWidth * 0.9;
const docHeight = document.documentElement.clientHeight * 0.9;

async function setBounce() {
  const logoContainer = document.getElementById("logo-container");
  const rootStyles = getComputedStyle(document.documentElement);
  logoContainer.classList.remove("go");

  const endX = parseInt(rootStyles.getPropertyValue("--end-x").trim(), 10);
  const endY = parseInt(rootStyles.getPropertyValue("--end-y").trim(), 10);
  const dir = rootStyles.getPropertyValue("--dir").trim();

  const dirInstructions = dirs[dir];

  const distance = Math.min(
    dirInstructions.x === 1 ? docWidth - endX : endX,
    dirInstructions.y === 1 ? docHeight - endY : endY,
  );
  const newEndX = endX + distance * dirInstructions.x;
  const newEndY = endY + distance * dirInstructions.y;

  let timeoutTime = distance / 100;

  const nextDir = getNextDir(dir, endX, newEndX, newEndY);

  document.documentElement.style.setProperty("--dir", nextDir);
  document.documentElement.style.setProperty("--start-x", `${endX}px`);
  document.documentElement.style.setProperty("--start-y", `${endY}px`);
  document.documentElement.style.setProperty("--end-x", `${newEndX}px`);
  document.documentElement.style.setProperty("--end-y", `${newEndY}px`);
  document.documentElement.style.setProperty(
    "--animation-duration",
    `${timeoutTime}s`,
  );

  logoContainer.classList.add("go");
  setTimeout(() => setBounce(), timeoutTime * 1000);
}

const dirs = {
  downright: {
    x: 1,
    y: 1,
  },
  upright: {
    x: 1,
    y: -1,
  },
  upleft: {
    x: -1,
    y: -1,
  },
  downleft: {
    x: -1,
    y: 1,
  },
};

function getNextDir(dir, endX, newEndX, newEndY) {
  // check if exactly corners, then opposite direction
  if (newEndX === 0 && newEndY === 0) {
    return "downright";
  }
  if (newEndX === 0 && newEndY === docHeight) {
    return "upright";
  }
  if (newEndX === docWidth && newEndY === 0) {
    return "downleft";
  }
  if (newEndX === docWidth && newEndY === docHeight) {
    return "upleft";
  }

  // see if x direction should stay same
  if (endX > newEndX) {
    // travelling left
    if (newEndX === 0) {
      // hit left wall
      if (dir === "downleft") {
        return "downright";
      } else {
        return "upright";
      }
    } else {
      // continue on
      if (dir === "downleft") {
        return "upleft";
      } else {
        return "downleft";
      }
    }
  } else {
    // travelling right
    if (newEndX === docWidth) {
      // hit right wall
      if (dir === "downright") {
        return "downleft";
      } else {
        return "upleft";
      }
    } else {
      // continue on
      if (dir === "downright") {
        return "upright";
      } else {
        return "downright";
      }
    }
  }
}

setBounce();
