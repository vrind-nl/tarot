function check(choice) {
    var answer = 'Goed'
    if( choice ) {
        answer = 'Fout! ' + choice
    }
    var result = document.getElementById("result")
    result.innerHTML = answer
    var next = document.getElementById("next")
    next.style.display = 'block'
}