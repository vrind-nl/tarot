import React from "react";
import { useParams } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

import { cards, cleanRecords, shuffle } from "../db";
import { Thumbnail, CardInfo } from "../components/Card";
import { Page } from "../components/Page";

function FormRow({ label, onChange, ...props }) {
  return (
    <tr>
      <td>{label}</td>
      <td>
        <input {...props} onChange={e => onChange(e.target)} />
      </td>
    </tr>
  );
}

export function Reading({ deck }) {
  const { perma } = useParams();
  const [config, setConfig] = React.useState({
    size: 3,
    reversed: true,
    majors: false
  });
  const [reading, setReading] = React.useState(() => {
    if (perma) {
      const nrs = perma.split("-");
      setConfig({
        ...config,
        reversed: nrs.splice(0, 1) === "1",
        size: nrs.length
      });
      return {
        cards: cleanRecords(
          nrs.map(nr => cards({ seqnr: parseInt(nr) }).first())
        ),
        info: -1,
        seqNr: 0,
        reversed: nrs.map(nr => nr.endsWith("R")),
        flipped: 1
      };
    }
    return {
      cards: draw(),
      info: -1,
      seqNr: 0,
      reversed: randomBools(config.size),
      flipped: 0
    };
  });

  function draw() {
    var shuffled = config.majors ? cards({ suite: "groot" }) : cards();
    shuffled = shuffle(shuffled.get());
    return cleanRecords(shuffled.splice(0, config.size));
  }

  function randomBools(length) {
    return Array.from({ length }, () => Math.random() > 0.5);
  }

  function handleInfo(nr, flipped) {
    if (flipped && reading.info === -1) {
      return;
    }
    if (nr === reading.info) {
      nr = -1;
    }
    setReading({ ...reading, info: nr });
  }

  return (
    <Page title="Legging">
      {reading.cards.length > 0 && (
        <div style={{ marginBottom: "20pt", display: "flex" }}>
          {reading.cards.map((card, nr) => (
            <div
              key={nr}
              style={{
                padding: "5pt",
                backgroundColor: nr === reading.info ? "purple" : "white"
              }}
            >
              <Thumbnail
                key={reading.seqNr}
                card={card}
                deck={deck}
                flipped={reading.flipped}
                reversed={config.reversed && reading.reversed[nr]}
                height="300pt"
                onClick={(e, flipped) => handleInfo(nr, flipped)}
                /* onTouchStart={(e, flipped) => handleInfo(nr, flipped)} */
              />
            </div>
          ))}
        </div>
      )}
      <HashLink
        to={
          `/legging/${config.reversed ? 1 : 0}-` +
          reading.cards
            .map(
              (card, nr) => `${card.seqnr}${reading.reversed[nr] ? "R" : ""}`
            )
            .join("-")
        }
      >
        Permalink
      </HashLink>
      {reading.info >= 0 && (
        <div className="definitions">
          <CardInfo {...reading.cards[reading.info]} />
        </div>
      )}
      <table style={{ marginTop: "20pt" }}>
        <tbody>
          <FormRow
            type="number"
            label="Aantal kaarten"
            value={config.size}
            min={0}
            max={10}
            onChange={({ value }) => setConfig({ ...config, size: value })}
          />
          <FormRow
            type="checkbox"
            label="Ondersteboven"
            checked={config.reversed}
            onChange={({ checked }) =>
              setConfig({ ...config, reversed: checked })
            }
          />
          <FormRow
            type="checkbox"
            label="Alleen Grote Arcana"
            checked={config.majors}
            onChange={({ checked }) =>
              setConfig({ ...config, majors: checked })
            }
          />
          <FormRow
            type="button"
            label=""
            value="Nieuwe legging"
            onClick={() =>
              setReading({
                info: -1,
                seqNr: reading.seqNr + 1,
                cards: draw(),
                reversed: randomBools(config.size),
                flipped: 0
              })
            }
          />
        </tbody>
      </table>
    </Page>
  );
}
