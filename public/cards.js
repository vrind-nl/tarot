function turn(choice) {
    var elems = document.querySelectorAll(".turned");

    [].forEach.call(elems, function(el) {
        el.classList.remove("turned");
    });
}

function explanation(card_id) {
    elem = document.querySelector(".explanation."+card_id);
    elem.classList.toggle("hidden");
}

window.addEventListener('DOMContentLoaded', (event) => {
    var cards = document.querySelectorAll('.card');
    [].forEach.call(cards, function(card) {
        card.addEventListener( 'click', function() {
            card.classList.toggle('is-flipped');
            elem = document.querySelector('.buttons.'+card.id);
            elem.classList.toggle("hidden");
            elem = document.querySelector(".explanation."+card.id);
            elem.classList.add("hidden");
        });
    })
});
