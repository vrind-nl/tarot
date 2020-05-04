import React from "react";

import { symbols } from "../db";
import { Page } from "../components/Page";
import { SymbolList } from "../components/Symbol";

export function Symbols() {
  return (
    <Page title="Symbolen">
      <SymbolList
        symbols={symbols()
          .order("name")
          .map(symbol => symbol)} // taffy.map does not provide a nr
      />
    </Page>
  );
}
