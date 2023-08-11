

document.addEventListener('DOMContentLoaded', function() {
    sendAnalytics(); // remove if you don't have analytics to send.

    // Desktop Icons 
    var windowElem = document.querySelector('.mainWindow');
    var titleBarElem = document.querySelector('.title-bar');
    var computerElem = document.querySelector('.computer');
    var aboutElem= document.querySelector('.about');
    var startupsElem= document.querySelector('.startups');
    var researchElem= document.querySelector('.research');
    var projectsElem= document.querySelector('.projects');
    var interestsElem= document.querySelector('.interests');
    var sinusoidElem= document.querySelector('.sinusoid');

    // Windows + Title Bars
    var titleBarElemAbout= document.querySelector('.title-bar-about');
    var windowElemAbout = document.querySelector('.aboutWindow');

    var titleBarElemStartups= document.querySelector('.title-bar-startups');
    var windowElemStartups = document.querySelector('.startupsWindow');

    var titleBarElemResearch= document.querySelector('.title-bar-research');
    var windowElemResearch = document.querySelector('.researchWindow');

    var titleBarElemProjects= document.querySelector('.title-bar-projects');
    var windowElemProjects = document.querySelector('.projectsWindow');

    var titleBarElemInterests= document.querySelector('.title-bar-interests');
    var windowElemInterests = document.querySelector('.interestsWindow');

    var titleBarElemSinusoid= document.querySelector('.title-bar-sinusoid');
    var windowElemSinusoid = document.querySelector('.sinusoidWindow');



    function preventDefaultBehavior(e) {
        e.preventDefault();
    }
    function bringToFront(event, element) {
        currentZIndex++; // Increment the current z-index
        element.style.zIndex = currentZIndex; // Assign the incremented z-index to the clicked window
    }


    var offsetX, offsetY, isDragging = false;
    var currentDraggingElem = null; // This will keep track of which element we're dragging

    titleBarElem.addEventListener('mousedown', function(event) {
        startDragging(event, windowElem);
    });

    titleBarElemAbout.addEventListener('mousedown', function(event) {
        startDragging(event, windowElemAbout);
    });

    titleBarElemStartups.addEventListener('mousedown', function(event) {
        startDragging(event, windowElemStartups);
    });
    titleBarElemResearch.addEventListener('mousedown', function(event) {
        startDragging(event, windowElemResearch);
    });
    titleBarElemProjects.addEventListener('mousedown', function(event) {
        startDragging(event, windowElemProjects);
    });
    titleBarElemInterests.addEventListener('mousedown', function(event) {
        startDragging(event, windowElemInterests);
    });
    titleBarElemSinusoid.addEventListener('mousedown', function(event) {
        startDragging(event, windowElemSinusoid);
    });


    titleBarElem.addEventListener('touchstart', function(event) {
        // Prevent default touch behavior
        event.preventDefault();
    
        // Use changedTouches[0] to get the first touch point's properties
        event.clientX = event.changedTouches[0].clientX;
        event.clientY = event.changedTouches[0].clientY;
        startDragging(event, windowElem);
    });

    titleBarElemAbout.addEventListener('touchstart', function(event) {
        // Prevent default touch behavior
        event.preventDefault();

        // Use changedTouches[0] to get the first touch point's properties
        event.clientX = event.changedTouches[0].clientX;
        event.clientY = event.changedTouches[0].clientY;
        startDragging(event, windowElemAbout);
    });

    titleBarElemStartups.addEventListener('touchstart', function(event) {
        // Prevent default touch behavior
        event.preventDefault();

        // Use changedTouches[0] to get the first touch point's properties
        event.clientX = event.changedTouches[0].clientX;
        event.clientY = event.changedTouches[0].clientY;
        startDragging(event, windowElemStartups);
    });

    titleBarElemResearch.addEventListener('touchstart', function(event) {
        // Prevent default touch behavior
        event.preventDefault();

        // Use changedTouches[0] to get the first touch point's properties
        event.clientX = event.changedTouches[0].clientX;
        event.clientY = event.changedTouches[0].clientY;
        startDragging(event, windowElemResearch);
    });

    titleBarElemProjects.addEventListener('touchstart', function(event) {
        // Prevent default touch behavior
        event.preventDefault();

        // Use changedTouches[0] to get the first touch point's properties
        event.clientX = event.changedTouches[0].clientX;
        event.clientY = event.changedTouches[0].clientY;
        startDragging(event, windowElemProjects);
    });

    titleBarElemInterests.addEventListener('touchstart', function(event) {
        // Prevent default touch behavior
        event.preventDefault();

        // Use changedTouches[0] to get the first touch point's properties
        event.clientX = event.changedTouches[0].clientX;
        event.clientY = event.changedTouches[0].clientY;
        startDragging(event, windowElemInterests);
    });
    titleBarElemSinusoid.addEventListener('touchstart', function(event) {
        // Prevent default touch behavior
        event.preventDefault();
        
        // Use changedTouches[0] to get the first touch point's properties
        event.clientX = event.changedTouches[0].clientX;
        event.clientY = event.changedTouches[0].clientY;
        startDragging(event, windowElemSinusoid);
    });



    var currentZIndex = 0; // Initialize with 0 or with the highest z-index you have on your page.

    function startDragging(event, element) {
        document.addEventListener('mousemove', preventDefaultBehavior);
        document.addEventListener('touchmove', preventDefaultBehavior);
        isDragging = true;
        currentDraggingElem = element;
        offsetX = event.clientX - element.getBoundingClientRect().left;
        offsetY = event.clientY - element.getBoundingClientRect().top;

        currentZIndex++; // Increment the current z-index
        currentDraggingElem.style.zIndex = currentZIndex; // Assign the incremented z-index to the dragged window

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('touchmove', onTouchMove);
        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('touchend', onMouseUp);
    }

    function onMouseMove(event) {
        if (!isDragging) return;

        var x = event.clientX - offsetX;
        var y = event.clientY - offsetY;

        currentDraggingElem.style.left = x + 'px';
        currentDraggingElem.style.top = y + 'px';
    }

    function onTouchMove(event) {
        event.preventDefault();
        
        // Use changedTouches[0] to get the first touch point's properties
        event.clientX = event.changedTouches[0].clientX;
        event.clientY = event.changedTouches[0].clientY;
    
        onMouseMove(event); // You can reuse the logic from the mouse move
    }

    function onMouseUp() {
        isDragging = false;
        currentDraggingElem = null;
        document.removeEventListener('mousemove', preventDefaultBehavior);
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('touchmove', preventDefaultBehavior);
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onMouseUp);
    }


    document.getElementById('okButton').addEventListener('click', function() {
        windowElem.style.display = 'none';
    });

    // document.getElementById('cancelButton').addEventListener('click', function() {
    //     windowElem.style.display = 'none';
    // });
    computerElem.addEventListener('dblclick', function() {
        if (windowElem.style.display === 'none' || !windowElem.style.display) {
            windowElem.style.display = 'block';
        } 
    });
    aboutElem.addEventListener('dblclick', function() {
        if (windowElemAbout.style.display === 'none' || !windowElemAbout.style.display) {
            windowElemAbout.style.display = 'block';
        }
    });
    startupsElem.addEventListener('dblclick', function() {
        if (windowElemStartups.style.display === 'none' || !windowElemStartups.style.display) {
            windowElemStartups.style.display = 'block';
        }
    });
    researchElem.addEventListener('dblclick', function() {
        if (windowElemResearch.style.display === 'none' || !windowElemResearch.style.display) {
            windowElemResearch.style.display = 'block';
        }
    });
    projectsElem.addEventListener('dblclick', function() {
        if (windowElemProjects.style.display === 'none' || !windowElemProjects.style.display) {
            windowElemProjects.style.display = 'block';
        }
    });
    interestsElem.addEventListener('dblclick', function() {
        if (windowElemInterests.style.display === 'none' || !windowElemInterests.style.display) {
            windowElemInterests.style.display = 'block';
        }
    });
    sinusoidElem.addEventListener('dblclick', function() {
        if (windowElemSinusoid.style.display === 'none' || !windowElemSinusoid.style.display) {
            windowElemSinusoid.style.display = 'block';
        }
    });


    //Desktop Touch Events
    document.querySelector('.close-btn').addEventListener('click', function() {
        windowElem.style.display = 'none';
    });
    document.querySelector('.close-btn-about').addEventListener('click', function() {
        windowElemAbout.style.display = 'none';
    });
    document.querySelector('.close-btn-startups').addEventListener('click', function() {
        windowElemStartups.style.display = 'none';
    });
    document.querySelector('.close-btn-research').addEventListener('click', function() {
        windowElemResearch.style.display = 'none';
    });
    document.querySelector('.close-btn-projects').addEventListener('click', function() {
        windowElemProjects.style.display = 'none';
    });
    document.querySelector('.close-btn-interests').addEventListener('click', function() {
        windowElemInterests.style.display = 'none';
    });
    document.querySelector('.close-btn-sinusoid').addEventListener('click', function() {
        windowElemSinusoid.style.display = 'none';
    });


    // Mobile Touch Events
    document.querySelector('.close-btn').addEventListener('touchstart', function() {
        windowElem.style.display = 'none';
    });
    document.querySelector('.close-btn-about').addEventListener('touchstart', function() {
        windowElemAbout.style.display = 'none';
    });
    document.querySelector('.close-btn-startups').addEventListener('touchstart', function() {
        windowElemStartups.style.display = 'none';
    });
    document.querySelector('.close-btn-research').addEventListener('touchstart', function() {
        windowElemResearch.style.display = 'none';
    });
    document.querySelector('.close-btn-projects').addEventListener('touchstart', function() {
        windowElemProjects.style.display = 'none';
    });
    document.querySelector('.close-btn-interests').addEventListener('touchstart', function() {
        windowElemInterests.style.display = 'none';
    });
    document.querySelector('.close-btn-sinusoid').addEventListener('touchstart', function() {
        windowElemSinusoid.style.display = 'none';
    });




    document.getElementById("AboutText").addEventListener('click', function() {
        if (windowElemAbout.style.display === 'none' || !windowElemAbout.style.display) {
            windowElemAbout.style.display = 'block';
        } 
    });
    document.getElementById("StartupsText").addEventListener('click', function() {
        if (windowElemStartups.style.display === 'none' || !windowElemStartups.style.display) {
            windowElemStartups.style.display = 'block';
       
        } 
    });
    document.getElementById("ResearchText").addEventListener('click', function() {
        if (windowElemResearch.style.display === 'none' || !windowElemResearch.style.display) {
            windowElemResearch.style.display = 'block';

        } 
    });
    document.getElementById("ProjectsText").addEventListener('click', function() {
        if (windowElemProjects.style.display === 'none' || !windowElemProjects.style.display) {
            windowElemProjects.style.display = 'block';
       
        } 
    });
    document.getElementById("InterestsText").addEventListener('click', function() {
        if (windowElemInterests.style.display === 'none' || !windowElemInterests.style.display) {
            windowElemInterests.style.display = 'block';
            
        } 
    });

    

    windowElem.addEventListener('click', function(event) {
        bringToFront(event, windowElem);
    });
    
    windowElemAbout.addEventListener('click', function(event) {
        bringToFront(event, windowElemAbout);
    });
    
    windowElemStartups.addEventListener('click', function(event) {
        bringToFront(event, windowElemStartups);
    });
    
    windowElemResearch.addEventListener('click', function(event) {
        bringToFront(event, windowElemResearch);
    });
    
    windowElemProjects.addEventListener('click', function(event) {
        bringToFront(event, windowElemProjects);
    });
    
    windowElemInterests.addEventListener('click', function(event) {
        bringToFront(event, windowElemInterests);
    });

    setTimeout(function() {
        var element = document.querySelector('.positioner');
        element.style.opacity = '0'; // set opacity to 0, which will fade out the div over 3 seconds
    }, 10000); // the delay of 10 seconds
    
    
    //Sinusoid code
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    const width = canvas.width;
    const height = canvas.height;

    let offset = 0; // This will give the movement effect

    function drawGrid() {
        const gridSize = 20;
        ctx.strokeStyle = "#555";
        for (let x = 0; x <= width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        for (let y = 0; y <= height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
    }

    function drawSinusoid() {
        ctx.fillStyle = "#333"; // dark background
        ctx.fillRect(0, 0, width, height);
    
        
    
        ctx.strokeStyle = "#FFF";
        ctx.beginPath();
        for (let x = 0; x < width; x++) {
            let y = height / 2 + Math.sin((x + offset) * 0.05) * 60 *Math.sin(x/100);
            ctx.lineTo(x, y);
        }
        ctx.stroke();
    
        pixelate();
        changeToNeonGreen();  // Call the function here
    
        offset += 2;
        requestAnimationFrame(drawSinusoid);
        drawGrid();
    }

    function pixelate() {
        const pixelSize = 5;
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        for (let y = 0; y < height; y += pixelSize) {
            for (let x = 0; x < width; x += pixelSize) {
                const i = (y * width + x) * 4;
                const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;

                for (let py = 0; py < pixelSize; py++) {
                    for (let px = 0; px < pixelSize; px++) {
                        const pi = ((y + py) * width + (x + px)) * 4;
                        data[pi] = avg;
                        data[pi + 1] = avg;
                        data[pi + 2] = avg;
                    }
                }
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }
    function changeToNeonGreen() {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
    
        for (let i = 0; i < data.length; i += 4) {
            // Check if the pixel color is not the background color
            if (data[i] !== 51 || data[i+1] !== 51 || data[i+2] !== 51) { // Assuming #333 (51, 51, 51) is the background color
                data[i] = 57;     // Red channel value for neon green
                data[i + 1] = 255; // Green channel value for neon green
                data[i + 2] = 20;  // Blue channel value for neon green
            }
        }
    
        ctx.putImageData(imageData, 0, 0);
    }

    drawSinusoid();


  });


  