import React from "react";

import { HashLink } from "react-router-hash-link";

import { terms } from "../db";
import { Page } from "../components/Page";
import { Terms as TermList } from "../components/Term";

export function Terms() {
  const categories = terms()
    .distinct("category")
    .sort();
  return (
    <Page title="Begrippen">
      <h2>Inhoud</h2>
      <ul>
        {categories.map((category, nr) => (
          <li key={nr}>
            <HashLink to={"/begrippen#" + category}>{category}</HashLink>
          </li>
        ))}
      </ul>
      {categories.map((category, nr) => (
        <div key={nr} id={category}>
          <h2>{category}</h2>
          <TermList
            terms={terms({ category })
              .order("order,name")
              .map(term => term)} // taffy.map does not provide a nr
          />
        </div>
      ))}
    </Page>
  );
}
