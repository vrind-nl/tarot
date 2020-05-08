import React from "react";
import { useParams, Redirect, Link } from "react-router-dom";

import { cards, cleanRecord } from "../db";
import { Page } from "../components/Page";
import { Thumbnail, CardInfo, cardLink } from "../components/Card";

export function Card(props) {
  const { suite, name } = useParams();
  const card = cleanRecord(cards({ suite, name }).first());
  const title =
    suite === "groot" ? `${card.number} - ${name}` : `${suite} ${name}`;

  const prev = card.seqnr > 1 ? card.seqnr - 1 : 78;
  const next = card.seqnr < 78 ? card.seqnr + 1 : 1;

  return (
    <Page title={title}>
      <table>
        <tbody>
          <tr>
            <td style={{ textAlign: "center" }}>
              <Thumbnail {...card} />
              <div style={{ marginTop: "15pt" }}>
                <Link to={"/card/number/" + prev}>&lt;&lt;&lt;</Link>
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
