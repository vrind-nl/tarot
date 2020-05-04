import React from "react";
import PropTypes from "prop-types";

import { symbols } from "../db";
import { Page } from "../components/Page";
import { SymbolLink } from "../components/Symbol";

function Definition({ name, refs, definition }) {
  return (
    <div id={name} style={{ marginTop: "10pt" }}>
      <div className="pure-u-1-5">{name}</div>
      <div className="pure-u-4-5">
        {definition}
        {refs.length > 0 && (
          <>
            {definition.length > 0 && <br />}
            (zie ook:{" "}
            {refs
              .map(ref => <SymbolLink key={ref} name={ref} />)
              .map((link, nr) => [nr > 0 && ", ", link])}
            )
          </>
        )}
      </div>
    </div>
  );
}

Definition.propTypes = {
  name: PropTypes.string.isRequired,
  definition: PropTypes.string.isRequired
};

export function Symbols() {
  return (
    <Page title="Symbolen">
      {symbols()
        .order("name")
        .map(symbol => (
          <Definition key={symbol.name} {...symbol} />
        ))}
    </Page>
  );
}
