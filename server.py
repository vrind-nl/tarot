from flask import Flask, render_template

import tarot


app = Flask(__name__)
deck = tarot.Deck()
symboliek = tarot.Symboliek()


@app.route("/")
def index():
    return render_template('index.jinja2')


@app.route("/card/<int:nr>")
def card(nr):
    return render_template('info.jinja2', card=deck.cards[nr], symbols=symboliek.symbolen)


@app.route("/quiz")
def question():
    q = deck.question()
    return render_template('question.jinja2', question=q, card=q.card, nr=deck.nr(q.card))


@app.route("/study")
def study():
    return render_template('study.jinja2', deck=deck, symbols=symboliek.symbolen)
