

document.addEventListener('DOMContentLoaded', function() {

    var aboutText= document.querySelector('.AboutText');
    
    var windowElem = document.querySelector('.mainWindow');
    var titleBarElem = document.querySelector('.title-bar');
    var computerElem = document.querySelector('.computer');

    var titleBarElemAbout= document.querySelector('.title-bar-about');
    var windowElemAbout = document.querySelector('.aboutWindow');

    var offsetX, offsetY, isDragging = false;
    var currentDraggingElem = null; // This will keep track of which element we're dragging

    titleBarElem.addEventListener('mousedown', function(event) {
        startDragging(event, windowElem);
    });

    titleBarElemAbout.addEventListener('mousedown', function(event) {
        startDragging(event, windowElemAbout);
    });

    

    function startDragging(event, element) {
        isDragging = true;
        currentDraggingElem = element;
        offsetX = event.clientX - element.getBoundingClientRect().left;
        offsetY = event.clientY - element.getBoundingClientRect().top;

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    function onMouseMove(event) {
        if (!isDragging) return;

        var x = event.clientX - offsetX;
        var y = event.clientY - offsetY;

        currentDraggingElem.style.left = x + 'px';
        currentDraggingElem.style.top = y + 'px';
    }

    function onMouseUp() {
        isDragging = false;
        currentDraggingElem = null;

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }


    document.getElementById('okButton').addEventListener('click', function() {
        windowElem.style.display = 'none';
    });

    document.getElementById('cancelButton').addEventListener('click', function() {
        windowElem.style.display = 'none';
    });
    computerElem.addEventListener('dblclick', function() {
        if (windowElem.style.display === 'none' || !windowElem.style.display) {
            windowElem.style.display = 'block';
        } 
        
    });
    document.querySelector('.close-btn').addEventListener('click', function() {
        windowElem.style.display = 'none';
    });
    document.querySelector('.close-btn-about').addEventListener('click', function() {
        windowElemAbout.style.display = 'none';
    });

    document.getElementById("AboutText").addEventListener('click', function() {
        if (windowElemAbout.style.display === 'none' || !windowElemAbout.style.display) {
            windowElemAbout.style.display = 'block';
        } 
    });
    
    
  });


  