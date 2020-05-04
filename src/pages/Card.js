import React from "react";
import { useParams } from "react-router-dom";

import { cards } from "../db";
import { Page } from "../components/Page";
import { CardInfo } from "../components/Card";

export function Card(props) {
  const { suite, name } = useParams();
  const card = cards({ suite, name });
  const title = suite === "groot" ? name : `${suite} ${name}`;

  return (
    <Page title={title}>
      <CardInfo {...card.first()} />
    </Page>
  );
}
