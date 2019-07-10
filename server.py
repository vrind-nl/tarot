import os
import random
import sys

from flask import Flask, render_template, request

import tarot


app = Flask(__name__)
symboliek = tarot.Symboliek()
deck = tarot.Deck(symboliek)


@app.route("/")
def index():
    return render_template("index.jinja2")


@app.route("/card/<int:nr>")
def card(nr):
    hidden = request.args.get("hidden", default=1, type=int)
    return render_template(
        "info.jinja2",
        card=deck.cards[nr],
        symbols=symboliek,
        hidden="hidden" if hidden else "",
    )


@app.route("/cards/", defaults=dict(turned=False, nr=3))
@app.route("/cards/<int:nr>", defaults=dict(turned=False))
def cards(nr, turned):
    hidden = request.args.get("hidden", default=1, type=int)
    return render_template(
        "cards.jinja2",
        cards=deck.pick(nr),
        nr=nr,
        deck=deck,
        symbols=symboliek,
        turned=turned,
        hidden="hidden" if hidden else "",
    )


@app.route("/turned/", defaults=dict(nr=3))
@app.route("/turned/<int:nr>")
def turned(nr):
    return cards(nr, True)


@app.route("/symbols")
def symbols():
    return render_template("symbols.jinja2", symbols=symboliek, deck=deck)


@app.route("/quiz")
def question():
    q_src = random.choice([deck, symboliek])
    q = q_src.question()
    return render_template(
        "question.jinja2", question=q, url="%s?hidden=0" % q_src.url(q.answer)
    )


@app.route("/overview")
def overview():
    return render_template("overview.jinja2", deck=deck, symbols=symboliek)


@app.route("/study")
def study():
    return render_template("study.jinja2", deck=deck, symbols=symboliek)


@app.route("/env")
def env():
    return "\n".join(
        ["<li>%s: %s</li>" % (key, val) for key, val in os.environ.items()]
    )


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
