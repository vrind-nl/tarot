import React from "react";
import { useParams, Redirect } from "react-router-dom";

import { cards, cleanRecord } from "../db";
import { Page } from "../components/Page";
import { Thumbnail, CardInfo, cardLink } from "../components/Card";

export function Card(props) {
  const { suite, name } = useParams();
  const card = cleanRecord(cards({ suite, name }).first());
  const title =
    suite === "groot" ? `${card.number} - ${name}` : `${suite} ${name}`;

  const prev = card.seqnr > 1 ? card.seqnr - 1 : 78;
  const next = card.seqnr < 78 ? card.seqnr + 1 : 0;

  return (
    <Page title={title}>
      <div className="pure-g">
        <div className="pure-u-1-5" style={{ textAlign: "center" }}>
          <Thumbnail {...card} className="pure-u-4-5" />
          <div style={{ marginTop: "15pt" }}>
            <a href={"/card/number/" + prev}>&lt;&lt;&lt;</a>
            {"  "}
            <a href={"/card/number/" + next}>&gt;&gt;&gt;</a>
          </div>
        </div>
        <div className="pure-u-4-5 definitions">
          <CardInfo {...card} />
        </div>
      </div>
    </Page>
  );
}

export function CardByNumber(props) {
  const { seqnr } = useParams();
  const card = cleanRecord(cards({ seqnr: parseInt(seqnr) }).first());
  return <Redirect to={cardLink(card)} />;
}
