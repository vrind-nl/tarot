import React from "react";
import { useParams, Redirect, Link } from "react-router-dom";

import { cards, cleanRecord, cardLink, cardTitle } from "../db";
import { Page } from "../components/Page";
import { Thumbnail, CardInfo } from "../components/Card";
import { roman2arabic } from "../roman";

export function Card(props) {
  const { suite, name } = useParams();
  const query = roman2arabic(name) ? { suite, number: name } : { suite, name };
  const card = cleanRecord(cards(query).first());

  const prev = card.seqnr > 1 ? card.seqnr - 1 : 78;
  const next = card.seqnr < 78 ? card.seqnr + 1 : 1;
  const rnd = Math.floor(Math.random() * 78) + 1;
  return (
    <Page title={cardTitle(card)}>
      <table>
        <tbody>
          <tr>
            <td style={{ textAlign: "center" }}>
              <Thumbnail {...card} />
              <div style={{ marginTop: "15pt" }}>
                <Link to={"/card/number/" + prev}>&lt;&lt;&lt;</Link>
                {"  "}
                <Link to={"/card/number/" + rnd}>X</Link>
                {"  "}
                <Link to={"/card/number/" + next}>&gt;&gt;&gt;</Link>
              </div>
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

export function CardByNumber(props) {
  const { seqnr } = useParams();
  const card = cleanRecord(cards({ seqnr: parseInt(seqnr) }).first());
  return <Redirect to={cardLink(card)} />;
}
