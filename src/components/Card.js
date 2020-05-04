import React from "react";
import PropTypes from "prop-types";

import { Link } from "react-router-dom";

import { findSymbol } from "../db";
import { SymbolList } from "./Symbol";

function Image({ suite, number, name, ...props }) {
  const safeName = name.replace(/ /g, "-");
  const src =
    suite === "groot"
      ? `/GroteArcana/${number}-${safeName}.jpg`
      : `/KleineArcana/${suite}/${suite}-${safeName}.jpg`;
  return <img src={src} alt={name} {...props} />;
}

Image.propTypes = {
  number: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  suite: PropTypes.string.isRequired
};

export function CardLink({ suite, name, children }) {
  return <Link to={`/card/${suite}/${name}`}>{children}</Link>;
}

CardLink.propTypes = {
  ___id: PropTypes.string.isRequired
};

export function Card(props) {
  return (
    <div style={{ textAlign: "center" }}>
      <CardLink {...props}>
        <Image {...props} height="200pt" />
      </CardLink>
      <br />
      {props.keyword}
    </div>
  );
}

Card.propTypes = {
  ___id: PropTypes.string.isRequired,
  keyword: PropTypes.string.isRequired,
  ...Image.propTypes
};

function OptionalInfo({ label, symbol, children }) {
  symbol = findSymbol(symbol);
  return children ? (
    <>
      <div className="pure-u-1-5">{label}: </div>
      <div className="pure-u-4-5">
        {children} {symbol && `(${symbol.definition})`}
      </div>
    </>
  ) : (
    ""
  );
}

export function CardInfo(props) {
  return (
    <div className="pure-g">
      <div className="pure-u-1-5" style={{ textAlign: "center" }}>
        <Image {...props} className="pure-u-4-5" />
        <br />
        {props.keyword}
      </div>
      <div className="pure-u-4-5 definitions">
        <OptionalInfo
          label="Arcana"
          symbol={props.suite === "groot" ? "Grote Arcana" : "Kleine Arcana"}
        >
          {props.suite === "groot" ? "Groot" : "Klein"}
        </OptionalInfo>
        <OptionalInfo label="Kleur" symbol={props.suite.toLowerCase()}>
          {props.suite !== "groot" && props.suite}
        </OptionalInfo>
        <OptionalInfo label="Nummer">{props.number}</OptionalInfo>
        <OptionalInfo label="Kaart" symbol={props.name}>
          {props.name}
        </OptionalInfo>
        <OptionalInfo label="Alias">{props.alias}</OptionalInfo>
        <OptionalInfo label="Kernwoorden">
          {props.keywords.join(", ")}
        </OptionalInfo>
        <OptionalInfo label="Uitnodiging">{props.invitation}</OptionalInfo>
        <OptionalInfo label="Waarschuwing">{props.warning}</OptionalInfo>
        {props.comment && (
          <OptionalInfo label="Opmerking">
            {typeof props.comment === "string"
              ? props.comment
              : props.comment.map((comment, nr) => <li key={nr}>{comment}</li>)}
          </OptionalInfo>
        )}
        <h3>Symbolen</h3>
        <SymbolList
          symbols={props.symbols.sort().map(name => ({
            name
          }))}
        />
      </div>
    </div>
  );
}
