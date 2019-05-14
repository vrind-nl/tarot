import csv
import os
import random


class Card:

    numbers = 'nul een twee drie vier vijf zes zeven acht negen tien'.split()

    def __init__(self, attrs):
        self.attrs = attrs

    def __str__(self):
        nummer = self.attrs['nummer']
        naam = self.attrs['naam']
        serie = self.attrs['serie']
        if serie == 'groot':
            naam = '%s (%s)' % (naam, nummer)
        else:
            naam = 'de %s van %s' % (naam, serie)
        
        return naam

    def img(self):
        nummer = self.attrs['nummer']
        naam = self.attrs['naam']
        serie = self.attrs['serie']
        if serie == 'groot':
            naam = 'GroteArcana/%s-%s' % (nummer, naam)
        else:
            naam = 'KleineArcana/%s/%s-%s' % (serie, serie, naam)
        
        naam = naam.replace(' ', '-')
        return '%s.jpg' % (naam)

    def randattr(self):
        return random.choice(['kernwoord', 'steekwoord', 'advies', 'negatief advies'])

    def get(self, attr):
        val = self.attrs[attr]
        if attr == 'steekwoord':
            val = random.choice(val.split(', '))
        return val

    def url(self):
        nummer = self.attrs['nummer']
        naam = self.attrs['naam']
        serie = self.attrs['serie']

        # special cases
        if serie == 'Zwaarden' and nummer == '9':
            return 'http://tarotstapvoorstap.nl/tarot-vragen/zwaarden-9-uit-de-tarot-ook-dit-gaat-voorbij/'
        if serie == 'Staven' and nummer == '6':
            return 'http://tarotstapvoorstap.nl/tarotkaarten/tarotkaarten-staven-zes/'
        if serie == 'Pentakels' and naam == 'Page':
            return 'http://tarotstapvoorstap.nl/tarotkaarten/tarotkaart-pentakels-schildknaap-page/'
        if serie == 'groot' and naam == 'De Dwaas':
            return 'http://tarotstapvoorstap.nl/tarotkaarten/de-dwaas-tarot-nul/'

        # general case
        if serie in ['groot']:
            if naam == 'Kracht':
                naam = 'De Kracht'
            elif naam == 'De Hogepriesteres':
                naam = 'Hogepriesteres'
            naam = 'tarotkaart-%s' % naam
        else:
            try:
                naam = self.numbers[int(nummer)]
            except IndexError:
                pass
            except ValueError:
                pass
            
            if naam == 'Page':
                naam = 'schildknaap'
                
            naam = 'tarotkaart-%s-%s' % (serie, naam)
            if serie in ['Pentakels'] and (nummer or self.attrs['naam'] == 'Aas'):
                naam = 'rider-waite-%s' % naam
        
        naam = naam.replace(' ', '-').lower()
        return 'https://tarotstapvoorstap.nl/tarotkaarten/%s/' % naam
       

class Question:

    def __init__(self, card, cards, attr):
        self.card = card
        self.cards = cards
        self.attr = attr

    def __str__(self):
        return 'Welk %s past het best bij %s?' % (self.attr, self.card)

    def answer(self):
        return self.cards.index(self.card)
 

class Deck:

    def __init__(self, filename='kaarten.csv'):
        self.cards = []
        with open(filename) as fin:
            reader = csv.DictReader(fin)
            for row in reader:
                self.cards.append(Card(row))

    def question(self):
        cards = [self.cards[r] for r in random.sample(range(0, len(self.cards)), 4)]
        card = random.choice(cards)
        return Question(card, cards, card.randattr())

    def test_links(self):
        from urllib.request import urlopen
        from urllib.error import HTTPError
        for card in self.cards:
            print(card)
            url = card.url()
            try:
                urlopen(url)
            except HTTPError as e:
                print(url, e)


if __name__ == '__main__':
    Deck().test_links()
