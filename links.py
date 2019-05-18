from urllib.parse import quote

def pictorialkey(self):
    ''' https://en.wikisource.org/wiki/The_Pictorial_Key_to_the_Tarot#Seven_of_Cups '''
    base = 'https://en.wikisource.org/wiki/The_Pictorial_Key_to_the_Tarot#'
    path = None

    if self.kleur == 'groot':
        namen = {
            'De Dwaas': '0. Zero. The Fool',
            'De Magier': 'I. The Magician',
            'De Hogepriesteres': 'II. The High Priestess',
            'De Keizerin': 'III. The Empress',
            'De Keizer': 'IV. The Emperor',
            'De Hogepriester': 'V. The Hierophant',
            'De Geliefden': 'VI. The Lovers',
            'De Zegewagen': 'VII. The Chariot',
            'Gerechtigheid': 'XI. Justice',
            'De Kluizenaar': 'IX. The Hermit',
            'Het Rad van Fortuin': 'X. Wheel of Fortune',
            'Kracht': 'VIII. Strength, or Fortitude',
            'De Gehangene': 'XII. The Hanged Man',
            'De Dood': 'XIII. Death',
            'Matigheid': 'XIV. Temperance',
            'De Duivel': 'XV. The Devil',
            'De Toren': 'XVI. The Tower',
            'De Ster': 'XVII. The Star',
            'De Maan': 'XVIII. The Moon',
            'De Zon': 'XIX. The Sun',
            'Het Oordeel': 'XX. The Last Judgment',
            'De Wereld': 'XXI. The World'
        }
        path = namen[self.naam]
    else:
        kleuren = dict(Staven='Wands', Pentakels='Pentacles', Zwaarden='Swords', Kelken='Cups')
        namen = dict(
            Aas='Ace',
            I='One',
            II='Two',
            III='Three',
            IV='Four',
            V='Five',
            VI='Six',
            VII='Seven',
            VIII='Eight',
            IX='Nine',
            X='Ten',
            Page='Page',
            Ridder='Knight',
            Koningin='Queen',
            Koning='King',
        )
        path = '%s of %s' % (namen[self.naam], kleuren[self.kleur])

    return base + path.replace(' ', '_')

def stapvoorstap(self):
    naam = self.naam

    # special cases
    if self.kleur == 'Zwaarden' and self.getal == '9':
        return 'http://tarotstapvoorstap.nl/tarot-vragen/zwaarden-9-uit-de-tarot-ook-dit-gaat-voorbij/'
    if self.kleur == 'Staven' and self.getal == '6':
        return 'http://tarotstapvoorstap.nl/tarotkaarten/tarotkaarten-staven-zes/'
    if self.kleur == 'Pentakels' and self.naam == 'Page':
        return 'http://tarotstapvoorstap.nl/tarotkaarten/tarotkaart-pentakels-schildknaap-page/'
    if self.kleur == 'groot' and self.naam == 'De Dwaas':
        return 'http://tarotstapvoorstap.nl/tarotkaarten/de-dwaas-tarot-nul/'

    # general case
    if self.kleur in ['groot']:
        if naam == 'Kracht':
            naam = 'De Kracht'
        elif naam == 'De Hogepriesteres':
            naam = 'Hogepriesteres'
        naam = 'tarotkaart-%s' % naam
    else:
        try:
            naam = self.numbers[int(self.getal)]
        except IndexError:
            pass
        except ValueError:
            pass
        
        if naam == 'Page':
            naam = 'schildknaap'
            
        naam = 'tarotkaart-%s-%s' % (self.kleur, naam)
        if self.kleur in ['Pentakels'] and (self.getal or self.naam == 'Aas'):
            naam = 'rider-waite-%s' % naam
    
    return 'https://tarotstapvoorstap.nl/tarotkaarten/%s/' % naam.replace(' ', '-').lower()

def kaartensterren(self):
    base = "http://www.kaartensterren.nl/pagina's tarotkaarten/"
    kleur = 'arcana' if self.kleur == 'groot' else self.kleur.lower()
    if kleur == 'kelken':
        kleur = 'bekers'

    romans = dict(O=0, I=1, II=2, III=3, IV=4, V=5, VI=6, VII=7, VIII=8, IX=9, X=10, XI=11, XII=12, XIII=13, XIV=14, XV=15, XVI=16, XVII=17, XVIII=18, XIX=19, XX=20, XXI=21)
    getal = romans[self.getal] if self.getal in romans else self.getal
    naam = self.naam.lower()
    if naam.startswith('de '):
        naam = naam[3:]
    elif naam.startswith('het '):
        naam = naam[4:]
    if naam == 'kluizenaar':
        naam = 'heremiet'
    elif naam == 'aas':
        naam = '01'
    elif naam == 'kracht':
        getal = '08'
    elif naam == 'gerechtigheid':
        getal = '11'
    elif naam == 'matigheid':
        naam = 'gematigdheid'

    getal = '%02d' % int(getal) if getal else naam    
    if kleur == 'arcana':
        naam = '%s %s' % (getal, naam)
    else:
        naam = ' '.join([kleur, getal])

    return quote(base + '%s/pagina %s.html' % (kleur, naam), safe=':/')


if __name__ == '__main__':
    import tarot
    from urllib.request import urlopen
    from urllib.error import HTTPError

    symboliek = tarot.Symboliek()
    deck = tarot.Deck(symboliek)

    for card in deck:
        # print(card)
        url = card.pictorialkey()
        print('<a href="%s" target="waite">%s</a><br/>' % (url, card))
        # try:
        #     urlopen(url)
        # except HTTPError:
        #     print(url)
