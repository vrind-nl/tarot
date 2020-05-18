import cardData from "./cards";
import termData from "./terms";

import taffy from "taffy";

import { roman2arabic } from "./roman";

export const terms = taffy(termData);
export const cards = taffy(cardData);

export function findTerm(name) {
  return terms({ name }).first();
}

export function suites(crds = cards) {
  return crds()
    .distinct("suite")
    .reduce((acc, suite) => {
      acc[suite] = crds({ suite });
      return acc;
    }, {});
}

export function cleanRecord(record) {
  delete record.___s;
  record.id = record.___id;
  delete record.___id;
  return record;
}

export function cleanRecords(records) {
  return records.map(record => record).map(cleanRecord);
}

export const cardName = ({ name, number }) => name || number;
export const cardTitle = ({ name, number, suite }) =>
  suite === "groot"
    ? `${number} - ${name}`
    : `${suite} ${cardName({ name, number })}`;

export const cardValue = ({ name, number }) =>
  (number = number
    ? roman2arabic(number)
    : { Aas: 1, Page: 11, Ridder: 12, Koningin: 13, Koning: 14 }[name]);

export const cardLink = ({ suite, ...card }) =>
  `/card/${suite}/${cardName(card)}`;

export function cardImg(card) {
  try {
    const safeName = cardName(card).replace(/ /g, "-");

    return card.suite === "groot"
      ? `/GroteArcana/${card.number}-${safeName}.jpg`
      : `/KleineArcana/${card.suite}/${card.suite}-${safeName}.jpg`;
  } catch (err) {
    console.log("Could not get image path for card: ", card);
    return "ERROR";
  }
}

export function shuffle(array) {
  // FisherYates algorithm
  let i = array.length;
  while (i--) {
    const ri = Math.floor(Math.random() * (i + 1));
    [array[i], array[ri]] = [array[ri], array[i]];
  }
  return array;
}

export function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}
