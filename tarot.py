from collections import defaultdict
import csv
import os
import random

from flask import url_for

import links


class Question:

    def __init__(self, options, attr, size=4):
        ''' options is list of question/answer pairs '''
        sample = None
        if type(options) == dict:
            sample = random.sample(options.keys(), size)
        else:
            sample = random.sample(range(0, len(options)), size)
        self.options = [options[r] for r in sample]
        self.nr = random.randint(0, size - 1)
        self.answer = self.options[self.nr]
        self.id = sample[self.nr]
        self.attr = attr

    def __str__(self):
        return 'Welk %s past het best bij %s?' % (self.attr, self.answer)


class Card:

    numbers = 'nul een twee drie vier vijf zes zeven acht negen tien'.split()

    def __init__(self, attrs):
        self.getal = attrs['getal']
        self.naam = attrs['naam']
        self.kleur = attrs['kleur']
        self.kernwoord = attrs['kernwoord']
        self.steekwoorden = attrs['steekwoorden']
        self.uitnodiging = attrs['uitnodiging']
        self.waarschuwing = attrs['waarschuwing']
        self.opmerking = attrs['opmerking']
        self.symbolen = sorted(s.strip() for s in attrs['symbolen'].split(',') if s)

    def __str__(self):
        naam = self.naam
        if self.kleur == 'groot':
            naam = '%s (%s)' % (naam, self.getal)
        else:
            naam = 'de %s van %s' % (naam, self.kleur)
        
        return naam

    @property
    def img(self):
        naam = self.naam
        if self.kleur == 'groot':
            naam = 'GroteArcana/%s-%s' % (self.getal, naam)
        else:
            naam = 'KleineArcana/%s/%s-%s' % (self.kleur, self.kleur, naam)
        
        return '%s.jpg' % naam.replace(' ', '-')

    def get_attr(self, attr):
        val = getattr(self, attr)
        if attr == 'steekwoorden':
            val = random.choice(val.split(', '))
        return val

    def link_symbols(self, symbols):
        for sym in self.symbolen:
            try:
                symbol = symbols[sym]
                symbol.cards.append(self)
            except KeyError:
                print('Link %s to %s FAILED' % (self, sym))

# monkey patch link methods
Card.pictorialkey = links.pictorialkey
Card.stapvoorstap = links.stapvoorstap
Card.kaartensterren = links.kaartensterren
Card.spiridoc = links.spiridoc


class Deck:

    def __init__(self, symboliek, filename='kaarten.csv'):
        self.cards = []
        try:
            from data import cards
            self.parse_rows(cards)
        except ImportError:
            print('Reading from CSV. You may want to run csv2.py')
            with open(filename) as fin:
                reader = csv.DictReader(fin)
                self.parse_rows(reader)
        for card in self.cards:
            card.link_symbols(symboliek.symbolen)

    def parse_rows(self, reader):
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

    def grote_arcana(self):
        return self.cards[:21]

    def kleine_arcana(self):
        return self.cards[22:]

    def question(self):
        return Question(self.cards, 
                        random.choice(['kernwoord', 'steekwoorden', 'uitnodiging', 'waarschuwing']))

    def nr(self, card):
        return self.cards.index(card)

    def url(self, card):
        return url_for('card', nr=self.nr(card))

    def link(self, card):
        return '<a href="%s?hidden=0">%s</a>' % (self.url(card), card.naam)

    def directions(self, nr):
        def move(jmp, bot, ceil): 
            ''' move within [bot, ceil> '''
            def clip(val):
                if val < bot:
                    return val + (ceil - bot)
                if val >= ceil:
                    return val - (ceil - bot)
                return val
            return (clip(nr - jmp), clip(nr + 1), clip(nr + jmp), clip(nr - 1))

        up, nxt, dwn, prv = move(10, 1, 21) if nr <= 21 else move(14, 22, 78)

        if nr == 0:
            up, dwn, prv = 11, 1, 21
        elif nr == 1:
            up, prv  = 0, 0
        elif nr == 10:
            up = 21
        elif nr == 11:
            dwn = 0
        elif nr == 20:
            dwn, nxt = 21, 21
        elif nr == 21:
            up, nxt, dwn = 20, 0, 10

        return up, nxt, dwn, prv

class Symbool:

    symboliek = None

    def __init__(self, row):
        self.naam = row['naam'].strip().lower()
        self.betekenis = row['betekenis']
        self.referenties = [r.strip().lower() for r in row['zie'].split(',') if r]
        self.cards = []

    def __str__(self):
        return self.naam

    def get_attr(self, attr):  # for quiz answer
        return self.symboliek.get(self)

    @property
    def img(self):
        try:
            card = random.choice(self.cards)
            return card.img
        except IndexError:
            return 'achterkant.jpg'

class Symboliek:

    def __init__(self, filename='symboliek.csv'):
        self.symbolen = {}
        Symbool.symboliek = self
        
        try:
            from data import symbols
            self.parse_rows(symbols)
        except ImportError:
            print('Reading from CSV. You may want to run csv2.py')
            with open(filename) as fin:
                reader = csv.DictReader(fin)
                self.parse_rows(reader)

    def parse_rows(self, reader):
        for row in reader:
            if row['naam']:
                symbool = Symbool(row)
                self.symbolen[symbool.naam] = symbool

    def get(self, naam):
        try:
            symbool = self.symbolen[naam.lower()]
        except KeyError:
            return ''
        except AttributeError:
            symbool = naam
        betekenis = symbool.betekenis
        if betekenis:
            if symbool.referenties:
                betekenis += ' (zie ook %s)' % ', '.join(self.link_for_name(r) for r in symbool.referenties)
        else:
            referenties = ['%s (via %s)' % (self.get(ref), ref) for ref in symbool.referenties]
            betekenis = ' '.join(referenties)

        return betekenis

    @staticmethod
    def link_for_name(name):
        url = url_for('symbols')
        return '<a href="%s#%s">%s</a>' % (url, name, name)

    def url(self, symbol):
        url = url_for('symbols')
        return '%s#%s' % (url, symbol.naam)

    def link(self, symbol):
        return '<a href="%s">%s</a>' % (symbol.url, symbol.naam)

    def question(self):
        return Question(self.symbolen, 'betekenis')
