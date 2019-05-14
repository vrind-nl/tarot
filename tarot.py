import csv
import os

class Card:

    def __init__(self, attrs):
        self.attrs = attrs

    def img(self):
        nummer = self.attrs['nummer']
        naam = self.attrs['naam']
        serie = self.attrs['serie']
        if serie == 'groot':
            naam = 'GroteArcana/%s-%s' % (nummer, naam)
        else:
            naam = 'KleineArcana/%s/%s-%s' % (serie, serie, naam or nummer)
        
        naam = naam.replace(' ', '-')
        return 'decks/RiderWaite/%s.jpg' % (naam)


class Deck:

    def __init__(self, filename='decks/kaarten.csv'):
        self.cards = []
        with open(filename) as fin:
            reader = csv.DictReader(fin)
            for row in reader:
                self.cards.append(Card(row))


deck = Deck()
for card in deck.cards:
    img = card.img()
    if not os.path.exists(img):
        print(img)