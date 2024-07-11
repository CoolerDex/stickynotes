const mediaQuery = window.matchMedia("(max-width: 1000px) and (min-height: 50px)");

document.addEventListener('DOMContentLoaded', function () {
    loadNotes();
});


function loadNotes() {
    var mainElement = document.getElementById('main');

    var savedInnerHTML = localStorage.getItem('mainInnerHTML');

    if (savedInnerHTML) {
        mainElement.innerHTML = savedInnerHTML;
        console.log('Loaded main content from localStorage.');

    } else {
        console.log('No saved main content found in localStorage.');
    }

    document.querySelectorAll('[contenteditable="true"]').forEach(function (element) {
        element.addEventListener('input', saveAll);
    });

}

function deleteNote(element) {
    var noteElement = element.closest('.note');
    if (noteElement) {
        noteElement.remove();
    }
    saveAll();

}

function startDrag(event, noteId) {
    console.log(`startDrag on ${noteId} called`);
    var note = document.getElementById(noteId);
    var header = document.getElementById('header');
    var main = document.getElementById('main');

    var headerRect = header.getBoundingClientRect();
    var headerBottom = headerRect.bottom;

    var mainRect = main.getBoundingClientRect();
    var mainLeft = mainRect.left;
    var mainTop = mainRect.top;
    var mainRight = mainRect.right;
    var mainBottom = mainRect.bottom;

    var initialX = event.clientX || event.touches[0].clientX;
    var initialY = event.clientY || event.touches[0].clientY;

    var initialNoteX = note.offsetLeft;
    var initialNoteY = note.offsetTop;

    var offsetX = initialX - initialNoteX;
    var offsetY = initialY - initialNoteY;

    function moveNote(event) {
        var newX = (event.clientX || event.touches[0].clientX) - offsetX;
        var newY = (event.clientY || event.touches[0].clientY) - offsetY;

        var minLeft = mainLeft;
        var maxLeft = mainRight - note.offsetWidth;
        var minTop = mainTop;
        var maxTop = mainBottom - note.offsetHeight;

        newX = Math.max(minLeft, Math.min(newX, maxLeft));
        newY = Math.max(minTop, Math.min(newY, maxTop));

        if (newY < headerBottom) {
            newY = headerBottom;
        }

        note.style.left = newX + 'px';
        note.style.top = newY + 'px';
    }

    function stopDrag() {
        document.removeEventListener('mousemove', moveNote);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchmove', moveNote);
        document.removeEventListener('touchend', stopDrag);

        saveAll();
    }

    document.addEventListener('mousemove', moveNote);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchmove', moveNote);
    document.addEventListener('touchend', stopDrag);

}



function addNewNote() {

    var allNotes = document.querySelectorAll('.note');
    var noteCount = allNotes.length;

    if (noteCount >= 20) {
        alert('You are not allowed to create more than 20 notes on Landscape displays.');
        return;
    } else if (mediaQuery.matches && noteCount >= 6) {
        alert('You are not allowed to create more than 6 notes on Portrait displays.');
        return;
    }

    var newNoteID = "note" + noteCount;
    allNotes.forEach(element => {
        if (element.id == newNoteID) {
            newNoteID += "+";
        }
    });

    var newNote = document.createElement('div');

    newNote.classList.add('note');
    newNote.id = newNoteID;
    newNote.addEventListener('input', saveAll);

    var newPosition = allNotes.length * 20;
    var styleLeft = 0 + newPosition;
    var styleTop = 50 + newPosition;
    newNote.style = `left: ${styleLeft}px; top: ${styleTop}px; z-index: ${newNoteID}`;

    var hexColor = getRandomLightHexColor();

    newNote.innerHTML = `
             <div>
                <div class="dragBar" onmousedown="startDrag(event, '${newNoteID}')" ontouchstart="startDrag(event, '${newNoteID}')" style="background-color: ${hexColor}">

                </div>
                <div onClick="deleteNote(this)">
                    ×
                </div>
                <div>
                   ${newNoteID}
                </div>
            </div>
            <div>
                <div contenteditable="true" onClick="saveAll()" spellcheck="false"  style="border:0.5vh solid ${hexColor}"></div>
            </div>
    `;

    var mainElement = document.getElementById('main');
    mainElement.appendChild(newNote);

    saveAll();
}
function clearAllButton() {
    var notes = document.querySelectorAll('.note');
    notes.forEach(element => {
        element.remove();
    });
    saveAll();

}

function saveAll() {

    var mainElement = document.getElementById('main');
    var mainInnerHTML = mainElement.innerHTML;

    localStorage.setItem('mainInnerHTML', mainInnerHTML);


}


function getRandomLightHexColor() {
    let r = Math.floor(70 + Math.random() * 130);
    let g = Math.floor(70 + Math.random() * 130);
    let b = Math.floor(70 + Math.random() * 130);

    let rHex = r.toString(16).padStart(2, '0');
    let gHex = g.toString(16).padStart(2, '0');
    let bHex = b.toString(16).padStart(2, '0');

    return `#${rHex}${gHex}${bHex}`;
}
