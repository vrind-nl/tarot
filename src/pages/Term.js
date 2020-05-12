import React from "react";

import { terms } from "../db";
import { Page } from "../components/Page";
import { Terms as TermList } from "../components/Term";

export function Terms() {
  const categories = terms()
    .distinct("category")
    .sort();
  return (
    <Page title="Begrippen">
      {categories.map(category => (
        <>
          <h2>{category}</h2>
          <TermList
            terms={terms({ category })
              .order("name")
              .map(term => term)} // taffy.map does not provide a nr
          />
        </>
      ))}
    </Page>
  );
}
