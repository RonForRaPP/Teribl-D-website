var teriblTouchParams = {};

var default_delay = 500;
var popup_delay = 2000;

var modal;

function setupTeriblTouch(terribleParams = {
    nextNum: '',
    prevNum: '',
    upNum: '',
    downNum: '',
    delay: '',
    popupImage: '',
}) {

    teriblTouchParams = terribleParams;

    if(!teriblTouchParams.delay) {
        teriblTouchParams.delay = default_delay;
    }

    if(teriblTouchParams.popupImage) {
        teriblTouchParams.delay = popup_delay;
        addPopup(teriblTouchParams.popupImage);
        setTimeout(function() {
            showPopup();
        }, popup_delay);
    }

    setTimeout(function () {
        setupListeners();
        console.log('Delayed listener setup by ' + teriblTouchParams.delay + 's');
    }, teriblTouchParams.delay);
}

function setupListeners() {
    var bg = document.getElementById('background-image');
    var hammertime = Hammer(bg);
    hammertime.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
    hammertime.on('swipe', function(ev) {
        switch(ev.direction) {
            case Hammer.DIRECTION_LEFT:
                console.log("Hammer swipe left, next page");
                goToPageNum(teriblTouchParams.nextNum);
                break;
            case Hammer.DIRECTION_RIGHT:
                console.log("Hammer swipe right, prev page");
                goToPageNum(teriblTouchParams.prevNum)
                break;
            case Hammer.DIRECTION_DOWN:
                console.log("Hammer swipe down, prev chapter");
                goToPageNum(teriblTouchParams.upNum)
                break;
            case Hammer.DIRECTION_UP:
                console.log("Hammer swipe up, next chapter");
                goToPageNum(teriblTouchParams.downNum)
                break;
        }
    });
    document.addEventListener("keydown", handleKeyPress, false);
}

function handleKeyPress(evt) {
    switch(evt.keyCode) {
        case 39:
            goToPageNum(teriblTouchParams.nextNum);
            console.log("Right arrow was pressed.")
            break;
        case 37:
            goToPageNum(teriblTouchParams.prevNum);
            console.log("Left arrow was pressed.")
            break;
        case 38:
            goToPageNum(teriblTouchParams.upNum);
            console.log("Up arrow was pressed.")
            break;
        case 40:
            goToPageNum(teriblTouchParams.downNum);
            console.log("Down arrow was pressed.")
            break;
        case 13:
            closePopup();
            console.log("Enter was pressed.")
            break;
    }
}

function goToPageNum(pageNum) {
    console.log("Go to page " + pageNum);
    if(modal) {
        console.log("Popup is preventing moving to a new page.");
        closePopup();
    } else {
        if(pageNum == 1) {
            window.location.href = "/";
        } else {
            window.location.href = "p" + pageNum + ".html";
        }
    }
}

function addPopup(popupImage) {
    modal = document.createElement("div");
    modal.style.display = "none";
    modal.setAttribute('class', 'modal');
    modal.innerHTML = '<button id="close">&times;</button>' +
        '<img src="styles/images/' + teriblTouchParams.popupImage + '" width="50%" height="50%">';
    document.body.append(modal);
    document.getElementById('close').addEventListener("click", function(){
        closePopup();
    });
}

function showPopup() {
    if(modal) {
        modal.style.display = "block";
        var hammertime = Hammer(modal);
        hammertime.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
        hammertime.on('swipe', function() {
            closePopup();
        });
        console.log("Popup shown.");
    }
}

function closePopup() {
    if(modal) {
        modal.style.display = "none";
        modal = null;
        console.log("Popup closed.");
    }
}