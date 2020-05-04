import cardData from "./cards";
import symbolData from "./symbols";

import taffy from "taffy";

export const symbols = taffy(symbolData);
export const cards = taffy(cardData);

export function findSymbol(name) {
  return symbols({ name }).first();
}

export function suites(crds = cards) {
  return crds()
    .distinct("suite")
    .reduce((acc, suite) => {
      acc[suite] = crds({ suite });
      return acc;
    }, {});
}
