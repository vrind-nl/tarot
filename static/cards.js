function turn(choice) {
    var elems = document.querySelectorAll(".turned");

    [].forEach.call(elems, function(el) {
        el.classList.remove("turned");
    });
}

function explanation() {
    var elems = document.querySelectorAll(".hidden");

    if(elems.length > 0) {
        [].forEach.call(elems, function(el) {
            el.classList.remove("hidden");
        })
    } else {
        elems = document.querySelectorAll(".explanation");
        [].forEach.call(elems, function(el) {
            el.classList.add("hidden");
        })
    }
}