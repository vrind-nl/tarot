import os
from urllib.request import urlopen
from urllib.error import HTTPError

import pytest

import tarot

@pytest.fixture
def deck():
    return tarot.Deck()


def test_img(deck):
    for card in deck:
        print(card)
        img = os.path.join('static', card.img())
        assert os.path.exists(img)
        
            
def test_url(deck):
    for card in deck:
        print(card)
        url = card.url()
        try:
            urlopen(url)
        except HTTPError as e:
            print(url, e)
    
