import os
from urllib.request import urlopen
from urllib.error import HTTPError

import pytest

import tarot

@pytest.fixture
def deck():
    return tarot.Deck()

@pytest.fixture
def symbols():
    return tarot.Symboliek().symbolen


def test_img(deck):
    errors = []
    for card in deck:
        img = os.path.join('static', card.img())
        if not os.path.exists(img):
            errors.append(img)
    assert not errors

            
def test_url(deck):
    errors = []
    for card in deck:
        url = card.url()
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
    assert not errors, 'Eerste %d van %d: %s' % (m, n, errors[:m])
