import React from "react";
import PropTypes from "prop-types";

import { HashLink } from "react-router-hash-link";

import { findTerm } from "../db";

import "./Term.css";

export function TermLink({ name }) {
  return <HashLink to={"/begrippen#" + name}>{name}</HashLink>;
}

export function Term({ name, term, refs, nr }) {
  if (term === "UNDEFINED") {
    const definition = findTerm(name);
    if (!term) {
      console.warn(`No term for [${name}]`);
    } else {
      refs = definition.refs;
      term = definition.definition;
    }
  }
  return (
    <div
      id={name}
      className="terms"
      style={nr % 2 === 0 ? { backgroundColor: "#eee" } : {}}
    >
      <div className="pure-u-1-5">{name}</div>
      <div className="pure-u-3-5">{term}</div>
      <div className="pure-u-1-5">
        {refs && refs.length > 0 && (
          <>
            {refs
              .map(ref => <TermLink key={ref} name={ref} />)
              .map((link, nr) => [nr > 0 && ", ", link])}
          </>
        )}
      </div>
    </div>
  );
}

Term.propTypes = {
  name: PropTypes.string.isRequired,
  term: PropTypes.string
};

Term.defaultProps = {
  term: "UNDEFINED",
  refs: []
};

export function Terms({ terms }) {
  return (
    <>
      <div className="pure-u-1-5">
        <b>Begrip</b>
      </div>
      <div className="pure-u-3-5">
        <b>Definitie</b>
      </div>
      <div className="pure-u-1-5">
        <b>Zie ook</b>
      </div>
      {terms.map((term, nr) => {
        return <Term key={term.name} {...term} nr={nr} />;
      })}
    </>
  );
}
