import React from "react";

import { Page } from "../components/Page";
import { Content } from "../components/Content";

export function Help(props) {
  return (
    <Page title="Uitleg">
      <Content file="help.html" />
    </Page>
  );
}
