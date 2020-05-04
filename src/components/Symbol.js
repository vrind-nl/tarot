import React from "react";
import PropTypes from "prop-types";

import { HashLink } from "react-router-hash-link";

import { findSymbol } from "../db";

import "./Symbol.css";

export function SymbolLink({ name }) {
  return <HashLink to={"/symbolen#" + name}>{name}</HashLink>;
}

export function Definition({ name, definition, refs, nr }) {
  if (definition === "UNDEFINED") {
    const symbol = findSymbol(name);
    if (!symbol) {
      console.warn(`No definition for [${name}]`);
    } else {
      refs = symbol.refs;
      definition = symbol.definition;
    }
  }
  return (
    <div
      id={name}
      className="definitions"
      style={nr % 2 === 0 ? { backgroundColor: "#eee" } : {}}
    >
      <div className="pure-u-1-5">{name}</div>
      <div className="pure-u-3-5">{definition}</div>
      <div className="pure-u-1-5">
        {refs && refs.length > 0 && (
          <>
            {refs
              .map(ref => <SymbolLink key={ref} name={ref} />)
              .map((link, nr) => [nr > 0 && ", ", link])}
          </>
        )}
      </div>
    </div>
  );
}

Definition.propTypes = {
  name: PropTypes.string.isRequired,
  definition: PropTypes.string
};

Definition.defaultProps = {
  definition: "UNDEFINED",
  refs: []
};

export function SymbolList({ symbols }) {
  return (
    <>
      <div className="pure-u-1-5">
        <b>Term</b>
      </div>
      <div className="pure-u-3-5">
        <b>Definitie</b>
      </div>
      <div className="pure-u-1-5">
        <b>Zie ook</b>
      </div>
      {symbols.map((symbol, nr) => {
        return <Definition key={symbol.name} {...symbol} nr={nr} />;
      })}
    </>
  );
}
