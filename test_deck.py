import os
from urllib.request import urlopen
from urllib.error import HTTPError

import pytest

import tarot


@pytest.fixture
def symbols():
    return tarot.Symboliek()


@pytest.fixture
def deck(symbols):
    return tarot.Deck(symbols)


def test_img(deck):
    errors = []
    for card in deck:
        img = os.path.join("static", card.img())
        if not os.path.exists(img):
            errors.append(img)
    assert not errors


def test_stapvoorstap(deck):
    errors = []
    for card in deck:
        print(card)
        url = card.stapvoorstap()()
        try:
            urlopen(url)
        except HTTPError:
            errors.append(url)
    assert not errors


def test_kaartensterren(deck):
    errors = []
    for card in deck:
        url = card.kaartensterren()
        try:
            urlopen(url)
        except HTTPError:
            errors.append(url)
    assert not errors


def test_spiridoc(deck):
    errors = []
    for card in deck.grote_arcana():
        url = card.spiridoc()
        try:
            urlopen(url)
        except HTTPError:
            errors.append(url)
    assert not errors


def test_symbols(deck, symbols):
    errors = []
    for card in deck:
        for sym in card.symbolen:
            if not symbols.get(sym):
                errors.append((sym, symbols.get(sym)))
    n = len(errors)
    m = min(10, n)
    assert not errors, "Eerste %d van %d: %s" % (m, n, errors[:m])


def test_kernwoord(deck):
    """ test if kernwoord is unique """
    kernwoorden = {}
    errors = []
    for card in deck:
        if card.kernwoord in kernwoorden:
            errors.append(
                "%s komt voor in %s en %s"
                % (card.kernwoord, card, kernwoorden[card.kernwoord])
            )
        else:
            kernwoorden[card.kernwoord] = str(card)
    assert not errors
