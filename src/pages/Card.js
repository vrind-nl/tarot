import React from "react";
import { useParams } from "react-router-dom";

import { cards, cleanRecord } from "../db";
import { Page } from "../components/Page";
import { Thumbnail, CardInfo } from "../components/Card";

export function Card(props) {
  const { suite, name } = useParams();
  const card = cleanRecord(cards({ suite, name }).first());
  const title = suite === "groot" ? name : `${suite} ${name}`;

  return (
    <Page title={title}>
      <div className="pure-g">
        <div className="pure-u-1-5" style={{ textAlign: "center" }}>
          <Thumbnail {...card} className="pure-u-4-5" />
        </div>
        <div className="pure-u-4-5 definitions">
          <CardInfo {...card} />
        </div>
      </div>
    </Page>
  );
}
