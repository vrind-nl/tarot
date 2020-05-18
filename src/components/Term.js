import React from "react";
import PropTypes from "prop-types";

import { HashLink } from "react-router-hash-link";

import { findTerm, cardLink, cardTitle, termCards } from "../db";
import { RawContent } from "./Content";

import "./Term.css";

export function TermLink({ name }) {
  return <HashLink to={"/begrippen#" + name}>{name}</HashLink>;
}

export function Term(props) {
  var { name, term, refs, link } = props;

  if (term === "UNDEFINED") {
    const definition = findTerm(name);
    if (!term) {
      console.warn(`No term for [${name}]`);
    } else {
      refs = definition.refs;
      term = definition.definition;
    }
  }

  if (!term && refs && refs.length === 1) {
    const derived = findTerm(refs[0]).definition;
    if (derived) {
      term = `${derived} (via ${refs[0]})`;
      refs = [];
    }
  }

  const cards = link || termCards(props);

  return (
    <tr id={name} className="terms">
      <td>{link ? <TermLink name={name} /> : name}</td>
      <td>
        <RawContent>{term}</RawContent>
      </td>
      <td>
        {refs && refs.length > 0 && (
          <>
            {refs
              .map(ref => <TermLink key={ref} name={ref} />)
              .map((link, nr) => [nr > 0 && ", ", link])}
            {cards && cards.length > 0 ? ", " : ""}
          </>
        )}
        {cards &&
          cards.length > 0 &&
          cards.map((card, nr) => (
            <span key={nr}>
              {nr > 0 && ", "}
              <HashLink to={cardLink(card)}>{cardTitle(card)}</HashLink>
            </span>
          ))}
      </td>
    </tr>
  );
}

Term.propTypes = {
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  term: PropTypes.string
};

Term.defaultProps = {
  term: "UNDEFINED",
  link: 0,
  refs: []
};

export function Terms({ terms, links }) {
  return (
    <table>
      <thead>
        <tr className="terms">
          <th>Begrip</th>
          <th>Betekenis</th>
          <th>Zie ook</th>
        </tr>
      </thead>
      <tbody>
        {terms.map((term, nr) => {
          return <Term key={term.name} {...term} nr={nr} link={links} />;
        })}
      </tbody>
    </table>
  );
}

Terms.defaultProps = {
  links: 0
};
