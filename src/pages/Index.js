import React from "react";

import { cards } from "../db";
import { Page } from "../components/Page";
import { Layout } from "../components/Layout";

export function Index(props) {
  return (
    <Page title="Tarot">
      <Layout cards={cards()} />
    </Page>
  );
}
