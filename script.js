

document.addEventListener('DOMContentLoaded', function() {

    var aboutText= document.querySelector('.AboutText');
    
    var windowElem = document.querySelector('.mainWindow');
    var titleBarElem = document.querySelector('.title-bar');
    var computerElem = document.querySelector('.computer');

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


    function preventDefaultBehavior(e) {
        e.preventDefault();
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

    var currentZIndex = 0; // Initialize with 0 or with the highest z-index you have on your page.

    function startDragging(event, element) {
        document.addEventListener('mousemove', preventDefaultBehavior);
        isDragging = true;
        currentDraggingElem = element;
        offsetX = event.clientX - element.getBoundingClientRect().left;
        offsetY = event.clientY - element.getBoundingClientRect().top;

        currentZIndex++; // Increment the current z-index
        currentDraggingElem.style.zIndex = currentZIndex; // Assign the incremented z-index to the dragged window

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
        document.removeEventListener('mousemove', preventDefaultBehavior);

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
    
    
  });


  