

document.addEventListener('DOMContentLoaded', function() {
    /*

    ANALYTICS SECTION

    */


    sendAnalytics(); // remove if you don't have analytics to send.


    /*

    EVENT LISTENER SECTION

    */


    // Info text fade
    setTimeout(function() { 
        var element = document.querySelector('.positioner');
        element.style.opacity = '0'; // set opacity to 0, which will fade out the div over 3 seconds
    }, 10000); // the delay of 10 seconds


    //To define additional windows, simply add them to the globalsMap with associated info. 
    const globalsMap = [ 
        { icon:".computer", window:"mainWindow", titlebar: 'title-bar-main', closebtn: 'close-btn-main',mainWindowLabel: null},
        { icon:".about", window:"aboutWindow", titlebar: 'title-bar-about', closebtn: 'close-btn-about', mainWindowLabel: "AboutText"},
        { icon:".startups", window:"startupsWindow", titlebar: 'title-bar-startups', closebtn: 'close-btn-startups', mainWindowLabel: "StartupsText"},
        { icon:".research", window:"researchWindow", titlebar: 'title-bar-research', closebtn: 'close-btn-research', mainWindowLabel: "ResearchText"},
        { icon:".projects", window:"projectsWindow", titlebar: 'title-bar-projects', closebtn: 'close-btn-projects', mainWindowLabel: "ProjectsText"},
        { icon:".interests", window:"interestsWindow", titlebar: 'title-bar-interests', closebtn: 'close-btn-interests', mainWindowLabel: "InterestsText"},
        { icon:".sinusoid", window:"sinusoidWindow", titlebar: 'title-bar-sinusoid', closebtn: 'close-btn-sinusoid', mainWindowLabel: null},
    ];

    var offsetX, offsetY, isDragging = false;
    var currentDraggingElem = null; // This will keep track of which element we're dragging
    var currentZIndex = 1; // Initialize with 0 or with the highest z-index you have on your page.


    // globalMap forEach loop that sets up listeners for core window interaction functionality:
    // 1) Icon Doubleclick -> open window
    // 2) Element focus (clicking on window -> bring to foreground)
    // 3) Dragging 
    // 4) Close button pressed -> hide window
    // 5) Main/landing window text pressed -> open window


    globalsMap.forEach(({icon,window,titlebar,closebtn,mainWindowLabel})=>{

        //Double click icon functionality
        var triggerElem = document.querySelector(icon);
        var targetElem = document.getElementById(window);
        
        triggerElem.addEventListener('dblclick', function() {
            if (targetElem.style.display === 'none' || !targetElem.style.display) {
                targetElem.style.display = 'block';
                bringToFront(targetElem);
            }
            else{
                bringToFront(targetElem); // bring to front if already displayed.
            }
        });



        //Dragging
        triggerElem = document.getElementById(titlebar);
        targetElem = document.getElementById(window);

        // For mouse behavior
        triggerElem.addEventListener('mousedown', function(event) {
            startDragging(event, targetElem);
        });

        // For touch behavior 
        triggerElem.addEventListener('touchstart', function(event) {
            // Prevent default touch behavior (text highlighting)
            event.preventDefault();
        
            // Use changedTouches[0] to get the first touch point's properties
            event.clientX = event.changedTouches[0].clientX;
            event.clientY = event.changedTouches[0].clientY;
            startDragging(event, targetElem);
        });


        //Closebtn mapping
        triggerElem = document.getElementById(closebtn);
        targetElem = document.getElementById(window);

        //close btn clicked on dekstop
        triggerElem.addEventListener('click', function() {
            targetElem.style.display = 'none';
        });

        //close btn tapped on mobile
        triggerElem.addEventListener('touchstart', function() {
            targetElem.style.display = 'none';
        });


        //Page launch from main window text mapping
        if(mainWindowLabel != null){

            triggerElem = document.getElementById(mainWindowLabel);
            targetElem = document.getElementById(window);

            triggerElem.addEventListener('click', function() {
                if (targetElem.style.display === 'none' || !targetElem.style.display) {
                    targetElem.style.display = 'block';
                    bringToFront(targetElem);
                } 
                else{ // Bring to front if the window is already displayed
                    bringToFront(targetElem);
                }
            });
        }


        //Brings window to front if clicked
        triggerElem = document.getElementById(window);

        // For mouse behavior
        triggerElem.addEventListener('mousedown', function(event) {
            bringToFront(triggerElem);
        });

        // For touch behavior 
        triggerElem.addEventListener('touchstart', function(event) {
            bringToFront(triggerElem);
        });
        

    })
    

    // Ok Button on main window
    var windowElem = document.querySelector('.mainWindow');

    document.getElementById('okButton').addEventListener('click', function() {
        windowElem.style.display = 'none';
    });


    // Helper Functions:

    function bringToFront(target){
        currentZIndex++;
        target.style.zIndex=currentZIndex;
    }


    function preventDefaultBehavior(e) {
        e.preventDefault();
    }

    function startDragging(event, element) {
        document.addEventListener('mousemove', preventDefaultBehavior);
        document.addEventListener('touchmove', preventDefaultBehavior);
        isDragging = true;
        currentDraggingElem = element;
        offsetX = event.clientX - element.getBoundingClientRect().left;
        offsetY = event.clientY - element.getBoundingClientRect().top;

        // currentZIndex++; // Increment the current z-index
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

    function onMouseUp() { // Cleans up event listeners after dragging is complete
        isDragging = false;
        currentDraggingElem = null;
        document.removeEventListener('mousemove', preventDefaultBehavior);
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('touchmove', preventDefaultBehavior);
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onMouseUp);
    }


    

    /*

    ANIMATION SECTION

    */




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


  