const axios = require("axios").default;
const process = require("process");

const cards = require("./cards");

const brokenOnly = process.argv.length == 3 && process.argv[2] === "broken";
const closed = ["Orakels"];

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
  if (!brokenOnly || link.broken) {
    return axios
      .get(link.url)
      .then(() => {
        delete link.broken;
        return link;
      })
      .catch(err => {
        link.broken = err.response.statusText;
        console.log(`   ${link.url}: ${link.broken}`);
        return link;
      });
  }
  return new Promise(resolve => resolve(link));
}

async function checkCard(card) {
  return new Promise(async resolve => {
    // console.log(cardTitle(card));
    card.links = await Promise.all(card.links.map(checkLink));
    resolve(card);
  });
}

async function main() {
  const checked = await Promise.all(cards.map(checkCard));
  console.log("=======================");
  console.log(JSON.stringify(checked));
}

main();
