const axios = require("axios").default;
const process = require("process");

const cards = require("./cards");

const brokenOnly = process.argv.length == 3 && process.argv[2] === "broken";
const closed = ["Orakels"];

const base = {
  "Pictorial Key to the Tarot (Eng)":
    "https://en.wikisource.org/wiki/The_Pictorial_Key_to_the_Tarot#",
  "Tarot Stap voor Stap": "https://tarotstapvoorstap.nl/tarotkaarten/",
  Catharinaweb: "https://www.catharinaweb.nl/tarot/tarot/",
  "Kaart en Sterren": "http://www.kaartensterren.nl/pagina's tarotkaarten/",
  "Le Tarot": "http://www.letarot.nl/",
  SpiriDoc: "http://www.spiridoc.nl/grotearcana/",
  Orakels: "https://www.orakels.net/tarot/oud-engels/"
};

// function roman2arabic(s) {
//   if (s === "O") {
//     return 0;
//   }
//   const map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
//   return [...s].reduce(
//     (r, c, i, s) => (map[s[i + 1]] > map[c] ? r - map[c] : r + map[c]),
//     0
//   );
// }

const cardName = ({ name, number }) => name || number;

// const cardValue = ({ name, number }) =>
//   (number = number
//     ? roman2arabic(number)
//     : { Aas: 1, Page: 11, Ridder: 12, Koningin: 13, Koning: 14 }[name]);

const cardTitle = ({ name, number, suite }) =>
  suite === "groot"
    ? `${number} - ${name}`
    : `${suite} ${cardName({ name, number })}`;

// cards.forEach(card => {
//   card.links = Object.keys(functions).map(key => ({
//     name: key,
//     url: functions[key](card)
//   }));
// });

async function checkLink(link) {
  if (closed.includes(link.name)) {
    return new Promise(resolve => resolve({ ...link, broken: "Closed" }));
  }
  const url = base[link.name] + link.url;
  if (!brokenOnly || link.broken) {
    return axios
      .get(url)
      .then(() => {
        delete link.broken;
        return link;
      })
      .catch(err => {
        if (err.response) {
          link.broken = err.response.statusText;
          console.log(`   ${link.url}: ${link.broken}`);
        } else {
          console.log(link, url, err);
        }
        return link;
      });
  }
  return new Promise(resolve => resolve(link));
}

async function checkCard(card) {
  try {
    var link = "ERROR";
    switch (card.suite) {
      case "groot":
        link = "" + (card.seqnr - 1);
        break;
      case "Staven":
        link = "s" + (card.seqnr - 22);
        break;
      case "Pentakels":
        link = "p" + (card.seqnr - 36);
        break;
      case "Zwaarden":
        link = "z" + (card.seqnr - 50);
        break;
      case "Kelken":
        link = "k" + (card.seqnr - 64);
        break;
    }
    card.links.push({
      name: "Catharina",
      url: link + ".htm"
    });
    return new Promise(async resolve => {
      // console.log(cardTitle(card));
      card.links = await Promise.all(card.links.map(checkLink));
      resolve(card);
    });
  } catch (err) {
    throw new Error(cardTitle(card) + ": " + err);
  }
}

async function main() {
  try {
    const checked = await Promise.all(cards.map(checkCard));
    console.log("=======================");
    console.log(JSON.stringify(checked));
  } catch (err) {
    console.log(err);
  }
}

main();
