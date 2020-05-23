import React from "react";
import { useParams } from "react-router-dom";

import { Page as PageComponent } from "../components/Page";
import { Content } from "../components/Content";

export function Page(props) {
  const { name } = useParams();

  return (
    <PageComponent title={name}>
      <Content file={`${name.toLowerCase()}.html`} />
    </PageComponent>
  );
}
