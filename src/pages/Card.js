import React from "react";
import { useParams, Redirect, Link } from "react-router-dom";

import { cards, cleanRecord, cardLink, cardTitle } from "../db";
import { Page } from "../components/Page";
import { Thumbnail, CardInfo } from "../components/Card";
import { roman2arabic } from "../roman";

function posmod(number, base, shift = 0) {
  // return positive (>0), shifted modulo
  const pm = (((number - shift) % base) + base) % base;
  return shift + (pm === 0 ? base : pm);
}

function compass({ suite, name, seqnr }) {
  const c = {
    prev: posmod(seqnr - 1, 78),
    next: posmod(seqnr + 1, 78)
  };

  if (suite === "groot") {
    c.up = posmod(seqnr - 10, 20, 1);
    c.down = posmod(seqnr + 10, 20, 1);
  } else {
    c.up = posmod(seqnr - 14, 56, 22);
    c.down = posmod(seqnr + 14, 56, 22);
  }

  const specials = {
    1: { up: 12, down: 2, prev: 21, next: 22 },
    2: { up: 1, prev: 22 },
    12: { up: 1, down: 1 },
    11: { up: 22 },
    21: { down: 22, next: 1 },
    22: { up: 21, down: 11, prev: 1, next: 2 }
  };

  return { ...c, ...specials[seqnr] };
}

export function Card() {
  const { suite, name } = useParams();
  const query = roman2arabic(name) ? { suite, number: name } : { suite, name };
  const card = cleanRecord(cards(query).first());
  const c = compass(card);

  const rnd = Math.floor(Math.random() * 78) + 1;
  return (
    <Page title={cardTitle(card)}>
      <table>
        <tbody>
          <tr>
            <td style={{ textAlign: "center" }}>
              <Thumbnail {...card} />
              <table style={{ marginTop: "15pt" }}>
                <tbody>
                  <tr>
                    <td>&nbsp;</td>
                    <td>
                      <Link to={"/card/number/" + c.up}>&uarr;</Link>
                    </td>
                    <td>&nbsp;</td>
                  </tr>
                  <tr>
                    <td>
                      <Link to={"/card/number/" + c.prev}>&larr;</Link>
                    </td>
                    <td>
                      <Link to={"/card/number/" + rnd}>X</Link>
                    </td>
                    <td>
                      <Link to={"/card/number/" + c.next}>&rarr;</Link>
                    </td>
                  </tr>
                  <tr>
                    <td>&nbsp;</td>
                    <td>
                      <Link to={"/card/number/" + c.down}>&darr;</Link>
                    </td>
                    <td>&nbsp;</td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td className="definitions">
              <CardInfo {...card} />
            </td>
          </tr>
        </tbody>
      </table>
    </Page>
  );
}

export function CardByNumber() {
  const { seqnr } = useParams();
  const card = cards({ seqnr: parseInt(seqnr) }).first();
  return card ? (
    <Redirect to={cardLink(card)} />
  ) : (
    `Kaart ${seqnr} niet gevonden.`
  );
}
