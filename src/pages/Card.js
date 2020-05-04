import React from "react";
import { useParams } from "react-router-dom";

import { cards } from "../db";
import { Page } from "../components/Page";
import { CardInfo } from "../components/Card";

export function Card(props) {
  const { name } = useParams();
  const card = cards({ name });

  return (
    <Page title={card.name}>
      <CardInfo {...card.first()} />
    </Page>
  );
}
