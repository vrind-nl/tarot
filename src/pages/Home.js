import React from "react";

import { suites as db } from "../db";
import { Page } from "../components/Page";
import { Layout } from "../components/Layout";

export function Home(props) {
  const suites = db();
  return (
    <Page className="container" title="Tarot">
      {Object.keys(suites).map(suite => (
        <Layout key={suite} title={suite} cards={suites[suite]} />
      ))}
    </Page>
  );
}
