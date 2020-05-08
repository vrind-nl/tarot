import React from "react";

import { cards, cleanRecords } from "../db";
import { Thumbnail, CardInfo } from "../components/Card";
import { Page } from "../components/Page";

function shuffleFisherYates(array) {
  let i = array.length;
  while (i--) {
    const ri = Math.floor(Math.random() * (i + 1));
    [array[i], array[ri]] = [array[ri], array[i]];
  }
  return array;
}

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

export function Reading() {
  const [config, setConfig] = React.useState({
    size: 3,
    reversed: false,
    majors: false
  });
  const [reading, setReading] = React.useState({
    cards: draw(),
    info: -1,
    seqNr: 0,
    reversed: randomBools(config.size)
  });

  function draw() {
    var shuffled = cards();
    if (config.majors) {
      shuffled = shuffled.filter({ suite: "groot" });
    }
    shuffled = shuffleFisherYates(shuffled.get());
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
                marginLeft: "10pt",
                backgroundColor: nr === reading.info ? "#ddd" : "white"
              }}
            >
              <Thumbnail
                key={reading.seqNr}
                {...card}
                flipped={0}
                reversed={config.reversed && reading.reversed[nr]}
                height="300pt"
                onClick={(e, flipped) => handleInfo(nr, flipped)}
                onTouch={(e, flipped) => handleInfo(nr, flipped)}
              />
            </div>
          ))}
        </div>
      )}
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
                reversed: randomBools(config.size)
              })
            }
          />
        </tbody>
      </table>
    </Page>
  );
}
