import React from "react";

export const decks = [
  "Smith Waite",
  "Morgan-Greer",
  "Connolly",
  "Roberts",
  "Crystal Visions",
  "Aquarian",
  "Marseilles"
];

export function cardImg(card, deck) {
  var seqnr = card.seqnr;

  // switch coins and cups: 65-78 <-> 37-50
  if (37 <= seqnr && seqnr <= 50) {
    seqnr += 28;
  } else if (65 <= seqnr && seqnr <= 78) {
    seqnr -= 28;
  }

  return `https://gfx.tarot.com/images/site/decks/${deck
    .toLowerCase()
    .replace(/ /g, "-")}/full_size/${seqnr - 1}.jpg`;
}

export function CardImage({ card, deck, ...props }) {
  return (
    <div>
      <img
        className="card"
        style={{ width: "150pt" }}
        src={cardImg(card, deck)}
        alt={deck}
        {...props}
      />
    </div>
  );
}

export function CardImages({ card, deck }) {
  return (
    <>
      {[deck].concat(decks.filter(d => d !== deck)).map((deck, nr) => (
        <div key={nr}>
          {deck}
          <br />
          <CardImage card={card} deck={deck} />
        </div>
      ))}
      (plaatjes van <a href="https://www.tarot.com/tarot/decks">tarot.com</a>)
    </>
  );
}
