import React from "react";

import { terms } from "../db";
import { Page } from "../components/Page";
import { Terms as TermList } from "../components/Term";

export function Terms() {
  return (
    <Page title="Begrippen">
      <TermList
        terms={terms()
          .order("name")
          .map(term => term)} // taffy.map does not provide a nr
      />
    </Page>
  );
}
