import cardData from "./cards";
import termData from "./terms";

import taffy from "taffy";

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
