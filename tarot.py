from collections import defaultdict
import csv
import random

from flask import url_for

import links
from roman import roman2int, int2roman


class Question:
    def __init__(self, options, attr, size=4):
        """ options is list of question/answer pairs """
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
        return "Welke %s past het best bij %s?" % (self.attr, self.answer)


class Card:  # pylint: disable=no-member,access-member-before-definition

    numbers = "nul een twee drie vier vijf zes zeven acht negen tien".split()

    def __init__(self, nr, attrs):
        self.nr = nr
        for attr in [
            "getal",
            "naam",
            "kleur",
            "kernwoord",
            "steekwoorden",
            "uitnodiging",
            "waarschuwing",
            "opmerking",
        ]:
            setattr(self, attr, attrs[attr])
        self.symbolen = sorted(s.strip() for s in attrs["symbolen"].split(",") if s)
        self.nummer = self.get_nummer()

    def __str__(self):
        naam = self.naam
        if self.kleur == "groot":
            naam = "%s (%s)" % (naam, self.getal)
        else:
            naam = "%s van %s" % (naam, self.kleur)

        return naam

    def get_nummer(self):
        """ get numerology number """

        def optellen(waarde):
            """ keep summing digits until there's one left """
            return waarde if waarde < 10 else optellen(sum(int(c) for c in str(waarde)))

        return optellen(self.waarde)

    def link_symbols(self, symbols):
        for sym in self.symbolen:
            try:
                symbol = symbols[sym]
                symbol.cards.append(self)
            except KeyError:
                print("Link %s to %s FAILED" % (self, sym))
        roman = int2roman(self.nummer)
        self.nummer = "%s (%s): %s" % (
            self.nummer,
            roman,
            symbols[roman.lower()].betekenis,
        )

    @property
    def img(self):
        naam = self.naam
        if self.kleur == "groot":
            naam = "GroteArcana/%s-%s" % (self.getal, naam)
        else:
            naam = "KleineArcana/%s/%s-%s" % (self.kleur, self.kleur, naam)

        return "%s.jpg" % naam.replace(" ", "-")

    def get_attr(self, attr, *args):
        val = getattr(self, attr)
        if attr == "steekwoorden":
            val = random.choice(val.split(", "))
        return val

    @property
    def waarde(self):
        waarde = None
        try:
            waarde = int(self.getal)
        except ValueError:
            try:
                waarde = roman2int(self.getal)
            except ValueError:
                try:
                    waarde = dict(Aas=1, Page=11, Ridder=12, Koningin=13, Koning=14)[
                        self.naam
                    ]
                except KeyError:
                    waarde = 0

        return waarde

    def directions(self):
        nr = self.nr

        def move(jmp, bot, ceil):
            """ move within [bot, ceil> """

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
            up, prv = 0, 0
        elif nr == 10:
            up = 21
        elif nr == 11:
            dwn = 0
        elif nr == 20:
            dwn, nxt = 21, 21
        elif nr == 21:
            up, nxt, dwn = 20, 0, 10

        return up, nxt, dwn, prv


# monkey patch link methods
Card.pictorialkey = links.pictorialkey
Card.stapvoorstap = links.stapvoorstap
Card.kaartensterren = links.kaartensterren
Card.spiridoc = links.spiridoc
Card.letarot = links.letarot


class Deck:
    def __init__(self, symboliek, filename="kaarten.csv"):
        self.cards = []
        self.shuffled = []
        try:
            from data import cards

            self.parse_rows(cards)
        except ImportError:
            print("Reading from CSV. You may want to run csv2.py")
            with open(filename) as fin:
                reader = csv.DictReader(fin)
                self.parse_rows(reader)
        for card in self:
            card.link_symbols(symboliek.symbolen)

        self.numbers = defaultdict(list)
        for card in self:
            nr = card.get_nummer()
            rom = int2roman(nr)
            self.numbers[rom].append(card)

    def parse_rows(self, reader):
        for nr, row in enumerate(reader):
            self.cards.append(Card(nr, row))

    def __iter__(self):
        self.current = -1
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
        return Question(
            self.cards,
            random.choice(["kernwoord", "steekwoorden", "uitnodiging", "waarschuwing"]),
        )

    def url(self, card):
        return url_for("card", nr=card.nr)

    def link(self, card):
        return '<a href="%s?hidden=0">%s</a>' % (self.url(card), card)

    def pick(self, amount=1):
        """ return random cards, by shuffling the deck and
        picking cards one by one until the deck is too small """
        if amount > len(self.shuffled):
            self.shuffled = self.cards[:]
            random.shuffle(self.shuffled)
        sample = self.shuffled[:amount]
        self.shuffled = self.shuffled[amount:]
        return sample

    @classmethod
    def permalink(cls, cards):
        return url_for("perma", nrs="-".join(str(c.nr) for c in cards))


Deck.order = dict(
    klassiek=list(range(0, 78)),
    waite=list(range(0, 78)),
    hersteld=[
        int(i)
        for i in (
            "0 1 2 4 6 78 5 3 7 9 8 21 11 12 14 13 15 79 16 18 17 19 20 10 49 "
            "48 47 46 36 37 38 39 40 41 42 43 44 45 35 34 33 32 22 23 24 25 26 "
            "27 28 29 30 31 77 76 75 74 64 65 66 67 68 69 70 71 72 73 63 62 61 "
            "60 50 51 52 53 54 55 56 57 58 59"
        ).split()
    ],
)

Deck.order["waite"][8] = 11
Deck.order["waite"][11] = 8


class Symbool:

    symboliek = None

    def __init__(self, row):
        self.naam = row["naam"].strip().lower()
        self.betekenis = row["betekenis"]
        self.referenties = [r.strip().lower() for r in row["zie"].split(",") if r]
        self.cards = []

    def __str__(self):
        return self.naam

    def get_attr(self, attr, referenties=True):  # for quiz answer
        return self.symboliek.get(self, referenties)

    @property
    def img(self):
        try:
            card = random.choice(self.cards)
            return card.img
        except IndexError:
            return "achterkant.jpg"


class Symboliek:
    def __init__(self, filename="symboliek.csv"):
        self.symbolen = {}
        Symbool.symboliek = self

        try:
            from data import symbols

            self.parse_rows(symbols)
        except ImportError:
            print("Reading from CSV. You may want to run csv2.py")
            with open(filename) as fin:
                reader = csv.DictReader(fin)
                self.parse_rows(reader)

    def parse_rows(self, reader):
        for row in reader:
            if row["naam"]:
                symbool = Symbool(row)
                self.symbolen[symbool.naam] = symbool

    def get(self, naam, referenties=True):
        if isinstance(naam, int):
            naam = str(naam)
        try:
            symbool = self.symbolen[naam.lower()]
        except KeyError:
            return ""
        except AttributeError:
            symbool = naam
        betekenis = symbool.betekenis
        if betekenis:
            if referenties and symbool.referenties:
                betekenis += " (zie ook %s)" % ", ".join(
                    self.link_for_name(r) for r in symbool.referenties
                )
        else:
            referenties = [
                "%s (via %s)" % (self.get(ref), ref) for ref in symbool.referenties
            ]
            betekenis = " ".join(referenties)

        return betekenis

    @staticmethod
    def link_for_name(name):
        url = url_for("symbols")
        return '<a href="%s#%s">%s</a>' % (url, name, name)

    def url(self, symbol):
        url = url_for("symbols")
        return "%s#%s" % (url, symbol.naam)

    def link(self, symbol):
        return '<a href="%s">%s</a>' % (symbol.url, symbol.naam)

    def question(self):
        return Question(self.symbolen, "betekenis")
