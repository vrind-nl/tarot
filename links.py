""" link generators to be monkey patched in the tarrot.Card class """
from urllib.parse import quote

from roman import roman2int


def pictorialkey(self):
    """ https://en.wikisource.org/wiki/The_Pictorial_Key_to_the_Tarot#Seven_of_Cups """
    base = "https://en.wikisource.org/wiki/The_Pictorial_Key_to_the_Tarot#"
    path = None

    if self.kleur == "groot":
        namen = {
            "De Dwaas": "0. Zero. The Fool",
            "De Magier": "I. The Magician",
            "De Hogepriesteres": "II. The High Priestess",
            "De Keizerin": "III. The Empress",
            "De Keizer": "IV. The Emperor",
            "De Hogepriester": "V. The Hierophant",
            "De Geliefden": "VI. The Lovers",
            "De Zegewagen": "VII. The Chariot",
            "Gerechtigheid": "XI. Justice",
            "De Kluizenaar": "IX. The Hermit",
            "Het Rad van Fortuin": "X. Wheel of Fortune",
            "Kracht": "VIII. Strength, or Fortitude",
            "De Gehangene": "XII. The Hanged Man",
            "De Dood": "XIII. Death",
            "Matigheid": "XIV. Temperance",
            "De Duivel": "XV. The Devil",
            "De Toren": "XVI. The Tower",
            "De Ster": "XVII. The Star",
            "De Maan": "XVIII. The Moon",
            "De Zon": "XIX. The Sun",
            "Het Oordeel": "XX. The Last Judgment",
            "De Wereld": "XXI. The World",
        }
        path = namen[self.naam]
    else:
        kleuren = dict(
            Staven="Wands", Pentakels="Pentacles", Zwaarden="Swords", Kelken="Cups"
        )
        namen = dict(
            Aas="Ace",
            I="One",
            II="Two",
            III="Three",
            IV="Four",
            V="Five",
            VI="Six",
            VII="Seven",
            VIII="Eight",
            IX="Nine",
            X="Ten",
            Page="Page",
            Ridder="Knight",
            Koningin="Queen",
            Koning="King",
        )
        path = "%s of %s" % (namen[self.naam], kleuren[self.kleur])

    return base + path.replace(" ", "_")


def stapvoorstap(self):
    naam = self.naam

    # special cases
    if self.kleur == "Zwaarden" and self.getal == "9":
        return "http://tarotstapvoorstap.nl/tarot-vragen/zwaarden-9-uit-de-tarot-ook-dit-gaat-voorbij/"
    if self.kleur == "Staven" and self.getal == "6":
        return "http://tarotstapvoorstap.nl/tarotkaarten/tarotkaarten-staven-zes/"
    if self.kleur == "Pentakels" and self.naam == "Page":
        return "http://tarotstapvoorstap.nl/tarotkaarten/tarotkaart-pentakels-schildknaap-page/"
    if self.naam == "De Dwaas":
        return "http://tarotstapvoorstap.nl/tarotkaarten/de-dwaas-tarot-nul/"

    # general case
    if self.kleur in ["groot"]:
        if naam == "Kracht":
            naam = "De Kracht"
        elif naam == "De Hogepriesteres":
            naam = "Hogepriesteres"
        elif naam == "De Kluizenaar":
            naam += "-heremiet"

        naam = "tarotkaart-%s" % naam
    else:
        try:
            naam = self.numbers[int(self.getal)]
        except IndexError:
            pass
        except ValueError:
            pass

        if naam == "Page":
            naam = "schildknaap"

        naam = "tarotkaart-%s-%s" % (self.kleur, naam)
        if self.kleur in ["Pentakels"] and (self.getal or self.naam == "Aas"):
            naam = "rider-waite-%s" % naam

    url = (
        "https://tarotstapvoorstap.nl/tarotkaarten/%s/" % naam.replace(" ", "-").lower()
    )
    return url


def kaartensterren(self):
    base = "http://www.kaartensterren.nl/pagina's tarotkaarten/"
    kleur = "arcana" if self.kleur == "groot" else self.kleur.lower()
    if kleur == "kelken":
        kleur = "bekers"

    try:
        getal = roman2int(self.getal)
    except ValueError:
        getal = self.getal

    naam = self.naam.lower()
    if naam.startswith("de "):
        naam = naam[3:]
    elif naam.startswith("het "):
        naam = naam[4:]
    if naam == "kluizenaar":
        naam = "heremiet"
    elif naam == "aas":
        naam = "01"
    elif naam == "kracht":
        getal = "08"
    elif naam == "gerechtigheid":
        getal = "11"
    elif naam == "matigheid":
        naam = "gematigdheid"

    getal = "%02d" % int(getal) if getal else naam
    if kleur == "arcana":
        naam = "%s %s" % (getal, naam)
    else:
        naam = " ".join([kleur, getal])

    return base + quote("%s/pagina %s.html" % (kleur, naam))


def spiridoc(self):
    """ http://www.spiridoc.nl/grotearcana/1_de_magier.htm """
    "http://www.spiridoc.nl/grotearcana/5_de_hierophant.htm"
    base = "http://www.spiridoc.nl/grotearcana/"

    naam = ""
    if self.kleur == "groot":
        try:
            getal = roman2int(self.getal)
        except ValueError:
            getal = self.getal

        naam = self.naam
        if getal == 20:
            getal = 2
        elif getal == 8:
            getal = 11
        elif getal == 11:
            getal = 8

        if naam == "De Hogepriester":
            naam = "de hierophant"
        if naam == "Gerechtigheid":
            naam = "rechtvaardigheid"
        elif naam == "Het Rad van Fortuin":
            naam = naam[4:]
        elif naam in ["De Dood", "De Gehangene"]:
            naam = naam[3:]

        naam = "%d %s.htm" % (getal, naam)
    return base + naam.lower().replace(" ", "_")


pages = [
    "01-de-dwaas-0-grote-arcana-de-tarot-in-de-herstelde-orde",
    "02-de-magier-1-grote-arcana-de-tarot-in-de-herstelde-orde",
    "03-de-priesteres-2-grote-arcana-de-tarot-in-de-herstelde-orde",
    "08-de-keizerin-6-grote-arcana-de-tarot-in-de-herstelde-orde",
    "04-de-keizer-3-grote-arcana-de-tarot-in-de-herstelde-orde",
    "07-de-priester-5-de-paus-grote-arcana-de-tarot-in-de-herstelde-orde",
    "05-de-geliefden-4-grote-arcana-de-tarot-in-de-herstelde-orde",
    "09-de-zegewagen-7-grote-arcana-de-tarot-in-de-herstelde-orde",
    "11-de-rechtvaardigheid-9-grote-arcana-de-tarot-in-de-herstelde-orde",
    "10-de-kluizenaar-8-de-heremiet-grote-arcana-de-tarot-in-de-herstelde-orde",
    "24-het-universum-21-grote-arcana-de-tarot-in-de-herstelde-orde",
    "13-de-kracht-11-grote-arcana-de-tarot-in-de-herstelde-orde",
    "14-de-gehangene-12-grote-arcana-de-tarot-in-de-herstelde-orde",
    "16-de-dood-14-grote-arcana-de-tarot-in-de-herstelde-orde",
    "15-de-gematigdheid-13-grote-arcana-de-tarot-in-de-herstelde-orde",
    "17-de-duivel-15-grote-arcana-de-tarot-in-de-herstelde-orde",
    "19-de-toren-16-grote-arcana-de-tarot-in-de-herstelde-orde",
    "21-de-ster-18-grote-arcana-de-tarot-in-de-herstelde-orde",
    "20-de-maan-17-grote-arcana-de-tarot-in-de-herstelde-orde",
    "22-de-zon-19-grote-arcana-de-tarot-in-de-herstelde-orde",
    "23-het-laatste-oordeel-20-grote-arcana-de-tarot-in-de-herstelde-orde",
    "12-de-wereld-10-het-rad-van-fortuin-grote-arcana-de-tarot-in-de-herstelde-orde",
    "43-staven-1-aas-stokken-scepters-knotsen-of-batons-kleine-arcana",
    "44-staven-2-twee-stokken-scepters-knotsen-of-batons-kleine-arcana",
    "45-staven-3-drie-stokken-scepters-knotsen-of-batons-kleine-arcana",
    "46-staven-4-vier-stokken-scepters-knotsen-of-batons-kleine-arcana",
    "47-staven-5-vijf-stokken-scepters-knotsen-of-batons-kleine-arcana",
    "48-staven-6-zes-stokken-scepters-knotsen-of-batons-kleine-arcana",
    "49-staven-7-zeven-stokken-scepters-knotsen-of-batons-kleine-arcana",
    "50-staven-8-acht-stokken-scepters-of-batons-kleine-arcana",
    "51-staven-9-negen-stokken-scepters-knotsen-of-batons-kleine-arcana",
    "52-staven-10-tien-stokken-scepters-knotsen-of-batons-kleine-arcana",
    "42-staven-page-schildknaap-hofkaart-stokken-scepters-knotsen-of-batons-kleine-arcana",
    "41-staven-ridder-hofkaart-stokken-scepters-knotsen-of-batons-kleine-arcana",
    "40-staven-koningin-hofkaart-stokken-scepters-knotsen-of-batons-kleine-arcana",
    "39-staven-koning-hofkaart-stokken-scepters-knotsen-of-batons-kleine-arcana",
    "29-pentagrammen-1-aas-munten-pentakels-of-schijven-kleine-arcana",
    "30-pentagrammen-2-twee-munten-pentakels-of-schijven-2-kleine-arcana",
    "31-pentagrammen-3-drie-munten-pentakels-of-schijven-kleine-arcana",
    "32-pentagrammen-4-vier-munten-pentakels-of-schijven-kleine-arcana",
    "33-pentagrammen-5-vijf-munten-pentakels-of-schijven-kleine-arcana",
    "34-pentagrammen-6-zes-munten-pentakels-of-schijven-kleine-arcana",
    "35-pentagrammen-7-zeven-munten-pentakels-of-schijven-kleine-arcana",
    "36-pentagrammen-8-acht-munten-pentakels-of-schijven-kleine-arcana",
    "37-pentagrammen-9-negen-munten-pentakels-of-schijven-kleine-arcana",
    "38-pentagrammen-10-tien-munten-pentakels-of-schijven-kleine-arcana",
    "28-pentagrammen-page-schildknaap-hofkaart-munten-pentakels-of-schijven-kleine-arcana",
    "27-pentagrammen-ridder-hofkaart-munten-pentakels-of-schijven-kleine-arcana",
    "26-pentagrammen-koningin-hofkaart-munten-pentakels-of-schijven-kleine-arcana",
    "25-pentagrammen-koning-hofkaart-munten-pentakels-of-schijven-kleine-arcana",
    "71-zwaarden-aas-1-een-kleine-arcana",
    "72-zwaarden-2-twee-kleine-arcana",
    "73-zwaarden-3-drie-kleine-arcana",
    "74-zwaarden-4-vier-kleine-arcana",
    "75-zwaarden-5-vijf-kleine-arcana",
    "76-zwaarden-6-zes-kleine-arcana",
    "77-zwaarden7-zeven",
    "78-zwaarden-08-acht-kleine-arcana",
    "79-zwaarden-09-negen-kleine-arcana",
    "80-zwaarden-10-tien-kleine-arcana",
    "70-zwaarden-page-schildknaap",
    "69-zwaarden-ridder-kleine-arcana",
    "68-zwaarden-koningin-hofkaart-kleine-arcana",
    "67-zwaarden-koning-hofkaart-kleine-arcana",
    "57-bekers-1-aas-een-bokalen-kleine-arcana",
    "58-bekers-bokalen-2-twee-kleine-arcana",
    "59-bekers-3-drie-bokalen-kleine-arcana",
    "60-bekers-4-vier-bokalen-kleine-arcana",
    "61-bekers-5-vijf-bokalen-kleine-arcana",
    "62-bekers-6-zes-bokalen-kleine-arcana",
    "63-bekers-7-zeven-bokalen",
    "64-bekers-bokalen-8-acht-kleine-arcana",
    "65-bekers-bokalen-9-negen-kleine-arcana",
    "66-bekers-10-tien-bokalen-kelken-kleine-arcana",
    "56-bekers-page-schildknaap-hofkaart-bokalen-kleine-arcana",
    "55-bekers-ridder-bokalen-hofkaart-kleine-arcana",
    "54-bekers-koningin-bokalen-hofkaart-kleine-arcana",
    "53-bekers-koning-bokalen-hofkaart-kleine-arcana",
    "06-de-intuitie-min-grote-arcana-de-tarot-in-de-herstelde-orde",
    "18-de-waarheid-plus-grote-arcana-de-tarot-in-de-herstelde-orde",
]


def letarot(self):
    return "http://www.letarot.nl/tarotkaart-" + pages[self.nr]


ORAKELS = [
    "dwaas",
    "magier",
    "hogepriesteres",
    "keizerin",
    "keizer",
    "de-hogepriester",
    "geliefden",
    "zegewagen",
    "kracht",
    "heremiet",
    "rad-van-fortuin",
    "gerechtigheid",
    "gehangene",
    "dood",
    "gematigdheid",
    "duivel",
    "toren",
    "ster",
    "zon",
    "maan",
    "oordeel",
    "wereld",
    "aas-van-staven",
    "staven-twee",
    "staven-drie",
    "staven-vier",
    "staven-vijf",
    "staven-zes",
    "staven-zeven",
    "staven-acht",
    "staven-negen",
    "staven-tien",
    "schildknaap-van-staven",
    "ridder-van-staven",
    "koningin-van-staven",
    "koning-van-staven",
    "aas-van-pentakels",
    "pentakels-twee",
    "pentakels-drie",
    "pentakels-vier",
    "pentakels-vijf",
    "pentakels-zes",
    "pentakels-zeven",
    "pentakels-acht",
    "pentakels-negen",
    "pentakels-tien",
    "schildknaap-van-pentakels",
    "ridder-van-pentakels",
    "koningin-van-pentakels",
    "koning-van-pentakels",
    "aas-van-zwaarden",
    "zwaarden-twee",
    "zwaarden-drie",
    "zwaarden-vier",
    "zwaarden-vijf",
    "zwaarden-zes",
    "zwaarden-zeven",
    "zwaarden-acht",
    "zwaarden-negen",
    "zwaarden-tien",
    "schildknaap-van-zwaarden",
    "ridder-van-zwaarden",
    "koningin-van-zwaarden",
    "koning-van-zwaarden",
    "aas-van-bekers",
    "bekers-twee",
    "bekers-drie",
    "bekers-vier",
    "bekers-vijf",
    "bekers-zes",
    "bekers-zeven",
    "bekers-acht",
    "bekers-negen",
    "bekers-tien",
    "schildknaap-van-bekers",
    "ridder-van-bekers",
    "koningin-van-bekers",
    "koning-van-bekers",
]


def orakels(self):
    return "https://www.orakels.net/tarot/oud-engels/" + ORAKELS[self.nr]


if __name__ == "__main__":
    import tarot
    from urllib.request import urlopen
    from urllib.error import HTTPError

    symboliek = tarot.Symboliek()
    deck = tarot.Deck(symboliek)

    for card in deck:
        # print(card)
        url = card.spiridoc()
        # print('<a href="%s" target="waite">%s</a><br/>' % (url, card))
        print(url)
        # try:
        #     urlopen(url)
        # except HTTPError:
        #     print(url)
