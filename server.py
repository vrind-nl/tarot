import random

from flask import Flask, render_template

import tarot


app = Flask(__name__)
symboliek = tarot.Symboliek()
deck = tarot.Deck()


@app.route("/")
def index():
    return render_template('index.jinja2')


@app.route("/card/<int:nr>")
def card(nr):
    return render_template('info.jinja2', deck=deck, symbols=symboliek, nr=nr)


@app.route("/cards/<int:nr>", defaults=dict(turned=False))
def cards(nr, turned):
    return render_template('cards.jinja2', cards=random.sample(deck.cards, nr), deck=deck, symbols=symboliek, turned=turned)


@app.route("/turned/<int:nr>")
def turned(nr):
    return cards(nr, True)


@app.route("/symbols")
def symbols():
    return render_template('symbols.jinja2', symbols=symboliek)


@app.route("/quiz")
def question():
    q = deck.question()
    return render_template('question.jinja2', question=q, card=q.card, nr=deck.nr(q.card))


@app.route("/overview")
def overview():
    return render_template('overview.jinja2', deck=deck, symbols=symboliek)


@app.route("/study")
def study():
    return render_template('study.jinja2', deck=deck, symbols=symboliek)


if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
