from flask import Flask, render_template

import tarot


app = Flask(__name__)
deck = tarot.Deck()


@app.route("/")
def question():
    return render_template('question.jinja2', question=deck.question())
