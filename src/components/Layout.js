import React from "react";
// import PropTypes from "prop-types";

import { Card } from "./Card";

function LayoutRow({ cards, layout }) {
  return (
    <tr>
      {layout.map((card, nr) => (
        <td key={nr}>{card !== null && <Card {...cards[card]} />}</td>
      ))}
    </tr>
  );
}

function LayoutSuite({ suite, cards, layout }) {
  cards = cards.filter({ suite }).get();

  return (
    <div>
      <h3>{suite === "groot" ? "Grote Arcana" : suite}</h3>
      <table>
        <tbody>
          {layout.map((row, nr) => (
            <LayoutRow key={nr} cards={cards} layout={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Layout({ cards }) {
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
    <LayoutSuite key={suite.suite} {...suite} cards={cards} />
  ));
}
