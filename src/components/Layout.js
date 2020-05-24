import React from "react";
// import PropTypes from "prop-types";

import { cleanRecords } from "../db";
import { Thumbnail } from "./Card";

function LayoutRow({ cards, layout, deck }) {
  return (
    <tr>
      {layout.map((card, nr) => (
        <td key={nr} style={{ textAlign: "center" }}>
          {card !== null && (
            <>
              <Thumbnail card={cards[card]} link={1} deck={deck} />
              {cards[card].keyword}
            </>
          )}
        </td>
      ))}
    </tr>
  );
}

function LayoutSuite({ suite, cards, layout, deck }) {
  cards = cards.filter({ suite }).get();

  return (
    <div>
      <h3>{suite === "groot" ? "Grote Arcana" : suite}</h3>
      <table>
        <tbody>
          {layout.map((row, nr) => (
            <LayoutRow
              key={nr}
              cards={cleanRecords(cards)}
              layout={row}
              deck={deck}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Layout({ cards, deck }) {
  const minorLayout = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [10, 11, 12, 13]
  ];
  const layout = [
    {
      suite: "groot",
      layout: [
        [0, null, null, null, null, null, null, null, null, 21],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        [11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
      ]
    },
    { suite: "Staven", layout: minorLayout },
    { suite: "Pentakels", layout: minorLayout },
    { suite: "Zwaarden", layout: minorLayout },
    { suite: "Kelken", layout: minorLayout }
  ];

  return layout.map(suite => (
    <LayoutSuite key={suite.suite} {...suite} cards={cards} deck={deck} />
  ));
}
