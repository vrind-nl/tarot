function turn(choice) {
    var elems = document.querySelectorAll(".turned");

    [].forEach.call(elems, function(el) {
        el.classList.remove("turned");
    });
}