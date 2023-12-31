const draggableWindow2 = document.getElementById('draggable-window2');
const canvas = document.getElementById('pixelCanvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
let isDragging2 = false;
let drawing = false;
let offsetX2, offsetY2;

draggableWindow2.addEventListener('mousedown', (e) => {
  if (!drawing) {
    isDragging2 = true;
    e.preventDefault();
    offsetX2 = e.clientX - draggableWindow2.getBoundingClientRect().left;
    offsetY2 = e.clientY - draggableWindow2.getBoundingClientRect().top;
  }
});

window.addEventListener('mouseup', () => {
  isDragging2 = false;
});

window.addEventListener('mousemove', (e) => {
  if (isDragging2 && !drawing) {
    e.preventDefault(); // Prevent default drag behavior
    draggableWindow2.style.left = (e.clientX - offsetX2) + 'px';
    draggableWindow2.style.top = (e.clientY - offsetY2) + 'px';
  }
});

canvas.addEventListener('mousedown', () => {
  drawing = true;
});

window.addEventListener('mouseup', () => {
  drawing = false;
});

const draggableWindow3 = document.getElementById('draggable-window3');
let isDragging3 = false;
let offsetX3, offsetY3;

draggableWindow3.addEventListener('mousedown', (e) => {
  isDragging3 = true;
  e.preventDefault();
  offsetX3 = e.clientX - draggableWindow3.getBoundingClientRect().left;
  offsetY3 = e.clientY - draggableWindow3.getBoundingClientRect().top;
});

window.addEventListener('mouseup', () => {
  isDragging3 = false;
});

window.addEventListener('mousemove', (e) => {
  if (isDragging3) {
    e.preventDefault(); // Prevent default drag behavior
    draggableWindow3.style.left = (e.clientX - offsetX3) + 'px';
    draggableWindow3.style.top = (e.clientY - offsetY3) + 'px';
  }
});


canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', draw);

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

const clearButton = document.getElementById('clearButton');
clearButton.addEventListener('click', clearCanvas);


function startDrawing(e) {
  drawing = true;
  draw(e); // To allow a single click to paint a pixel
}

function stopDrawing() {
  drawing = false;
  ctx.beginPath(); // Ensures the next line drawn is independent from the last
}

function draw(e) {
  if (!drawing) return;

  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top) * scaleY;

  // Calculate rounded coordinates
  const roundedX = Math.floor(x);
  const roundedY = Math.floor(y);

  // Draw at the exact position with full opacity
  drawPixel(roundedX, roundedY, 1);

  // Draw at top, left, right, and bottom positions with 50% opacity
  drawPixel(roundedX, roundedY - 1, 0.5); // Top
  drawPixel(roundedX, roundedY + 1, 0.5); // Bottom
  drawPixel(roundedX - 1, roundedY, 0.5); // Left
  drawPixel(roundedX + 1, roundedY, 0.5); // Right
}


// Helper function to draw a black rectangle (pixel)
function drawPixel(x, y, alpha = 1) {
  if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
    ctx.globalAlpha = alpha; // Set the alpha (opacity)
    ctx.fillStyle = 'black';
    ctx.fillRect(x, y, 1, 1);
    ctx.globalAlpha = 1; // Reset alpha to default
  }
}

canvas.addEventListener('touchstart', startDrawingTouch, false);
canvas.addEventListener('touchend', stopDrawing, false);
canvas.addEventListener('touchmove', drawTouch, false);

function startDrawingTouch(e) {
  e.preventDefault(); // Prevent scrolling when touching the canvas
  drawing = true;
  
  const touch = e.touches[0];
  drawTouch(e);
}

function drawTouch(e) {
  if (!drawing) return;
  e.preventDefault(); // Prevent scrolling when touching the canvas
  
  const touch = e.touches[0];
  
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  
  const x = (touch.clientX - rect.left) * scaleX;
  const y = (touch.clientY - rect.top) * scaleY;
  
  const roundedX = Math.floor(x);
  const roundedY = Math.floor(y);
  
  drawPixel(roundedX, roundedY, 1);
  drawPixel(roundedX, roundedY - 1, 0.5); // Top
  drawPixel(roundedX, roundedY + 1, 0.5); // Bottom
  drawPixel(roundedX - 1, roundedY, 0.5); // Left
  drawPixel(roundedX + 1, roundedY, 0.5); // Right
}


const logButton = document.getElementById('logButton');
logButton.addEventListener('click', logCanvasData);
function logCanvasData() {
  const pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let grid = [];

  for (let y = 0; y < canvas.height; y++) {
    let row = [];

    for (let x = 0; x < canvas.width; x++) {
      // Calculate the index into the pixelData array
      const idx = (y * canvas.width + x) * 4;

      // Get the alpha component of the pixel
      const alpha = pixelData[idx + 3];

      // Add the alpha value to the row
      row.push(alpha);
    }

    // Add the row to the grid
    grid.push(row);
  }
  let input = [];
  for (let i = 0; i < grid.length; i++) {
    input = input.concat(grid[i]);
  }
  const jsonString = JSON.stringify(input);
  main(input);

}

let session;

// Function to load the model
async function loadModel() {
    try {
        session = await ort.InferenceSession.create('./mnist-12.onnx');
        console.log('model loaded');
    } catch (e) {
        document.write(`failed to load ONNX model: ${e}.`);
    }
}

window.onload = loadModel;


async function main(number) {
  try {
    //start time 
    const startTime = performance.now();
    const arrayLength = 784;
    let canvasArray = number;
    canvasArray = canvasArray.map(num => num / 255);
    const canvasTensor = new ort.Tensor('float32', canvasArray, [1, 1, 28, 28]);

    // prepare feeds. use model input names as keys.
    const feeds = { Input3: canvasTensor };

    // feed inputs and run
    const results = await session.run(feeds);

    // read from results
    const resultsData = results.Plus214_Output_0.data;

    // Results is currently a 1D logits array, but since we don't need to know probabilities or backpropogate, we can just argmax it to get the most likely class.
    const largestIndex = resultsData.indexOf(Math.max(...resultsData));

    const numberClass = document.getElementById('outputNum');
    numberClass.innerText = largestIndex;
    const endTime = performance.now();
    const outputTime = document.getElementById('outputTime');
    let delta = endTime - startTime;
    delta = delta.toFixed(2);
    outputTime.innerText = `${delta}`;

    const inferenceLabel = document.getElementById('inferenceLabel');
    inferenceLabel.innerText = ' ms';

    console.log(`${delta} ms`);

  } catch (e) {
    document.write(`failed to inference ONNX model: ${e}.`);
  }
}

