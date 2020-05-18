import React from "react";

import { roman2arabic } from "../roman";
import { cardName, cardValue } from "../db";

function pictorialKey({ suite, name }) {
  // https://en.wikisource.org/wiki/The_Pictorial_Key_to_the_Tarot#Seven_of_Cups """
  const base = "https://en.wikisource.org/wiki/The_Pictorial_Key_to_the_Tarot#";
  var path;

  if (suite === "groot") {
    path = {
      "De Dwaas": "0. Zero. The Fool",
      "De Magier": "I. The Magician",
      "De Hogepriesteres": "II. The High Priestess",
      "De Keizerin": "III. The Empress",
      "De Keizer": "IV. The Emperor",
      "De Hogepriester": "V. The Hierophant",
      "De Geliefden": "VI. The Lovers",
      "De Zegewagen": "VII. The Chariot",
      Gerechtigheid: "XI. Justice",
      "De Kluizenaar": "IX. The Hermit",
      "Het Rad van Fortuin": "X. Wheel of Fortune",
      Kracht: "VIII. Strength, or Fortitude",
      "De Gehangene": "XII. The Hanged Man",
      "De Dood": "XIII. Death",
      Matigheid: "XIV. Temperance",
      "De Duivel": "XV. The Devil",
      "De Toren": "XVI. The Tower",
      "De Ster": "XVII. The Star",
      "De Maan": "XVIII. The Moon",
      "De Zon": "XIX. The Sun",
      "Het Oordeel": "XX. The Last Judgment",
      "De Wereld": "XXI. The World"
    }[name];
  } else {
    const suites = {
      Staven: "Wands",
      Pentakels: "Pentacles",
      Zwaarden: "Swords",
      Kelken: "Cups"
    };
    const namen = {
      Aas: "Ace",
      I: "One",
      II: "Two",
      III: "Three",
      IV: "Four",
      V: "Five",
      VI: "Six",
      VII: "Seven",
      VIII: "Eight",
      IX: "Nine",
      X: "Ten",
      Page: "Page",
      Ridder: "Knight",
      Koningin: "Queen",
      Koning: "King"
    };
    path = `${namen[name]} of ${suites[suite]}`;
  }
  return base + path.replace(/ /g, "_");
}

function stapVoorStap({ suite, name, number }) {
  const site = "http://tarotstapvoorstap.nl/";
  const base = site + "tarotkaarten/";
  // special cases
  if (suite === "Zwaarden" && number === "9") {
    return site + "tarot-vragen/zwaarden-9-uit-de-tarot-ook-dit-gaat-voorbij/";
  }
  if (suite === "Staven" && number === "6") {
    return base + "tarotkaarten-staven-zes/";
  }
  if (suite === "Pentakels" && name === "Page") {
    return base + "tarotkaart-pentakels-schildknaap-page/";
  }
  if (name === "De Dwaas") {
    return base + "de-dwaas-tarot-nul/";
  }

  //  general case
  if (suite === "groot") {
    if (name === "Kracht") {
      name = "De Kracht";
    } else if (name === "De Hogepriesteres") {
      name = "Hogepriesteres";
    } else if (name === "De Kluizenaar") {
      name += "-heremiet";
    }

    name = `tarotkaart-${name}`;
  } else {
    try {
      name = [
        "nul",
        "een",
        "twee",
        "drie",
        "vier",
        "vijf",
        "zes",
        "zeven",
        "acht",
        "negen",
        "tien"
      ][parseInt(number)];
    } catch (err) {}

    if (name === "Page") {
      name = "schildknaap";
    }

    name = `tarotkaart-${suite}-${name}`;
    if (suite === "Pentakels" && (number || name === "Aas")) {
      name = `rider-waite-${name}`;
    }
  }

  return base + name.replace(/ /g, "-").toLowerCase();
}

function kaartEnSterren(card) {
  var { suite, name, number } = card;
  const base = "http://www.kaartensterren.nl/pagina's tarotkaarten";
  suite = suite === "groot" ? "arcana" : suite.toLowerCase();
  if (suite === "kelken") {
    suite = "bekers";
  }

  name = cardName(card).toLowerCase();
  number = cardValue(card);

  if (name.startsWith("de ")) {
    name = name.substring(3);
  } else if (name.startsWith("het ")) {
    name = name.substring(4);
  }
  if (name === "kluizenaar") {
    name = "heremiet";
  } else if (name === "aas") {
    name = "01";
  } else if (name === "kracht") {
    number = "08";
  } else if (name === "gerechtigheid") {
    number = "11";
  } else if (name === "matigheid") {
    name = "gematigdheid";
  }

  number = number ? String(number).padStart(2, "0") : name;
  if (suite === "arcana") {
    name = `${number} ${name}`;
  } else {
    name = `${suite} ${number}`;
  }

  return `${base}/${suite}/pagina ${name}.html`;
}

function spiriDoc(card) {
  var { suite, name, number } = card;
  // http://www.spiridoc.nl/grotearcana/1_de_magier.htm
  // "http://www.spiridoc.nl/grotearcana/5_de_hierophant.htm"
  const base = "http://www.spiridoc.nl/grotearcana/";
  name = cardName(card);

  if (suite === "groot") {
    number = roman2arabic(number) || number;

    if (number === 20) {
      number = 2;
    } else if (number === 8) {
      number = 11;
    } else if (number === 11) {
      number = 8;
    }

    if (name === "De Hogepriester") {
      name = "de hierophant";
    }
    if (name === "Gerechtigheid") {
      name = "rechtvaardigheid";
    } else if (name === "Het Rad van Fortuin") {
      name = name.substring(4);
    } else if (name in ["De Dood", "De Gehangene"]) {
      name = name.substring(3);
    }

    name = `${number} ${name.toLowerCase()}.htm`;
  }
  return base + name.replace(/ /g, "_");
}

const LE_TAROT = [
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
  "18-de-waarheid-plus-grote-arcana-de-tarot-in-de-herstelde-orde"
];

function leTarot({ seqnr }) {
  return "http://www.letarot.nl/tarotkaart-" + LE_TAROT[seqnr - 1];
}

const ORAKELS = [
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
  "koning-van-bekers"
];

function orakels({ seqnr }) {
  return "https://www.orakels.net/tarot/oud-engels/" + ORAKELS[seqnr - 1];
}

function Ref({ href, children }) {
  return (
    <li>
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    </li>
  );
}

export function CardLinks(props) {
  orakels(props); // silence warning while not in use
  return (
    <ul>
      <Ref href={pictorialKey(props)}>Pictorial Key to the Tarot (Eng)</Ref>
      <Ref href={stapVoorStap(props)}>Tarot Stap Voor Stap</Ref>
      <Ref href={kaartEnSterren(props)}>Kaart en Sterren</Ref>
      <Ref href={leTarot(props)}>Le Tarot</Ref>
      <Ref href={spiriDoc(props)}>SpiriDoc</Ref>
      {/* <Ref href={orakels(props)}>Orakels</Ref> */}
    </ul>
  );
}
