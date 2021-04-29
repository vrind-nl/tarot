import React from "react";

import {
  cards,
  shuffle,
  suites,
  cleanRecord,
  randomElement,
  cardName,
  cardTitle
} from "../db";
import { CardImage } from "../components/Card";
import { Page } from "../components/Page";

function QuestionImage(props) {
  return <CardImage {...props} width="210pt" height="300pt" />;
}

function ClippedImage(props) {
  return (
    <QuestionImage
      {...props}
      style={{
        objectFit: "cover",
        objectPosition: "0 -20pt",
        borderBottom: "2px solid black",
        borderTop: "2px solid black"
      }}
    />
  );
}

function CardQuestion({ cards, setAnswer }) {
  const card = cleanRecord(cards[0]);
  const fieldNames = {
    keyword: "Kernwoord",
    invitation: "Uitnodiging",
    warning: "Waarschuwing"
  };
  const fields = Object.keys(fieldNames);
  const field = randomElement(fields);

  const answers = shuffle(
    cards.splice(0, 4).map((card, nr) => (
      <p key={nr}>
        <input
          type="checkbox"
          checked={false}
          onClick={() =>
            setAnswer(
              `${nr ? "FOUT: niet" : "GOED:"} ${fieldNames[field]} "${
                card[field]
              }" ${nr ? `maar "${cards[0][field]}"` : ""} hoort bij ${cardTitle(
                card
              )}`
            )
          }
        />
        {card[field]}
      </p>
    ))
  );

  return (
    <table>
      <tbody>
        <tr>
          <td>
            <ClippedImage {...card} />
          </td>
          <td>
            Welke {fieldNames[field].toLowerCase()} hoort bij deze kaart?
            {answers}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export function Quiz() {
  const [shuffled, setShuffled] = React.useState(shuffle(cards().get()));
  const [answer, setAnswer] = React.useState();
  const Question = CardQuestion;

  function check() {}

  return (
    <Page title="Quiz">
      <Question cards={shuffled} setAnswer={setAnswer} />
      {answer}
      <p>
        <button onClick={() => setShuffled(shuffle([...shuffled]))}>
          Volgende vraag
        </button>
      </p>
    </Page>
  );
}
