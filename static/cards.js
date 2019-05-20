function turn(choice) {
    var elems = document.querySelectorAll(".turned");

    [].forEach.call(elems, function(el) {
        el.classList.remove("turned");
    });
}

function explanation(card_id) {
    elems = document.querySelectorAll(".explanation."+card_id);
    [].forEach.call(elems, function(el) {
        el.classList.toggle("hidden");
    })
}

window.addEventListener('DOMContentLoaded', (event) => {
    var cards = document.querySelectorAll('.card');
    [].forEach.call(cards, function(card) {
        card.addEventListener( 'click', function() {
            card.classList.toggle('is-flipped');
            elems = document.querySelectorAll('.buttons.'+card.id);
            [].forEach.call(elems, function(el) {
                el.classList.toggle("hidden");
            })
        });
    })
});
