from collections import defaultdict
import csv
import os
import random

from flask import url_for


class Card:

    numbers = 'nul een twee drie vier vijf zes zeven acht negen tien'.split()

    def __init__(self, attrs):
        self.nummer = attrs['nummer']
        self.naam = attrs['naam']
        self.serie = attrs['serie']
        self.kernwoord = attrs['kernwoord']
        self.steekwoord = attrs['steekwoord']
        self.advies = attrs['advies']
        self.negatief_advies = attrs['negatief advies']
        self.opmerking = attrs['opmerking']
        self.symbolen = sorted(s.strip() for s in attrs['symbolen'].split(',') if s)

    def __str__(self):
        naam = self.naam
        if self.serie == 'groot':
            naam = '%s (%s)' % (naam, self.nummer)
        else:
            naam = 'de %s van %s' % (naam, self.serie)
        
        return naam

    @property
    def img(self):
        naam = self.naam
        if self.serie == 'groot':
            naam = 'GroteArcana/%s-%s' % (self.nummer, naam)
        else:
            naam = 'KleineArcana/%s/%s-%s' % (self.serie, self.serie, naam)
        
        return '%s.jpg' % naam.replace(' ', '-')

    def randattr(self):
        return random.choice(['kernwoord', 'steekwoord', 'advies', 'negatief advies'])

    def get(self, attr):
        val = getattr(self, attr)
        if attr == 'steekwoord':
            val = random.choice(val.split(', '))
        return val

    @property
    def url(self):
        naam = self.naam

        # special cases
        if self.serie == 'Zwaarden' and self.nummer == '9':
            return 'http://tarotstapvoorstap.nl/tarot-vragen/zwaarden-9-uit-de-tarot-ook-dit-gaat-voorbij/'
        if self.serie == 'Staven' and self.nummer == '6':
            return 'http://tarotstapvoorstap.nl/tarotkaarten/tarotkaarten-staven-zes/'
        if self.serie == 'Pentakels' and self.naam == 'Page':
            return 'http://tarotstapvoorstap.nl/tarotkaarten/tarotkaart-pentakels-schildknaap-page/'
        if self.serie == 'groot' and self.naam == 'De Dwaas':
            return 'http://tarotstapvoorstap.nl/tarotkaarten/de-dwaas-tarot-nul/'

        # general case
        if self.serie in ['groot']:
            if naam == 'Kracht':
                naam = 'De Kracht'
            elif naam == 'De Hogepriesteres':
                naam = 'Hogepriesteres'
            naam = 'tarotkaart-%s' % naam
        else:
            try:
                naam = self.numbers[int(self.nummer)]
            except IndexError:
                pass
            except ValueError:
                pass
            
            if naam == 'Page':
                naam = 'schildknaap'
                
            naam = 'tarotkaart-%s-%s' % (self.serie, naam)
            if self.serie in ['Pentakels'] and (self.nummer or self.naam == 'Aas'):
                naam = 'rider-waite-%s' % naam
        
        return 'https://tarotstapvoorstap.nl/tarotkaarten/%s/' % naam.replace(' ', '-').lower()
       

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

    def __iter__(self):
        self.current = 0
        return self

    def __next__(self):
        self.current += 1
        if self.current >= len(self.cards):
            raise StopIteration
        return self.cards[self.current]

    def question(self):
        cards = [self.cards[r] for r in random.sample(range(0, len(self.cards)), 4)]
        card = random.choice(cards)
        return Question(card, cards, card.randattr())

    def nr(self, card):
        return self.cards.index(card)

    def directions(self, nr):
        if nr == 0:
            return (11, 21, 1, 21)
        elif nr == 1:
            return (0,2,11,10)
        elif nr == 21:
            return (20,0,10,0)
        elif nr == 10:
            return (21,1,20,9)

        if self.cards[nr].serie == 'groot':
            return (
                nr - 10 if nr > 10 else nr + 10,
                nr + 1 if nr < 20 else 11,
                nr + 10 if nr < 11 else nr - 10,
                nr - 1 if nr > 1 else 20
            )
        else:
            return (
                nr - 14 if nr > 35 else nr + 42,
                nr + 1 if nr < 77 else 14,
                nr + 14 if nr < 36 else nr - 42,
                nr - 1 if nr > 22 else 77
            )

        return (0,0,0,0)

class Symbool:

    def __init__(self, row):
        self.naam = row['naam'].strip().lower()
        self.betekenis = row['betekenis']
        self.referenties = [r.strip().lower() for r in row['zie'].split(',') if r]

    def __str__(self):
        return self.naam


class Symboliek:

    def __init__(self, filename='symboliek.csv'):
        self.symbolen = {}
        with open(filename) as fin:
            reader = csv.DictReader(fin)
            for row in reader:
                if row['naam']:
                    symbool = Symbool(row)
                    self.symbolen[symbool.naam] = symbool

    def get(self, naam):
        try:
            symbool = self.symbolen[naam.lower()]
        except KeyError:
            return ''
        betekenis = symbool.betekenis
        if betekenis:
            if symbool.referenties:
                betekenis += ' (zie ook %s)' % ', '.join(self.link(r) for r in symbool.referenties)
        else:
            referenties = ['%s (via %s)' % (self.get(ref), ref) for ref in symbool.referenties]
            betekenis = ' '.join(referenties)

        return betekenis

    @staticmethod
    def link(name):
        url = url_for('symbols')
        return '<a href="%s#%s">%s</a>' % (url, name, name)