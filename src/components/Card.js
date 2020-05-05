import React from "react";
import PropTypes from "prop-types";

import { Link } from "react-router-dom";

import { findSymbol } from "../db";
import { SymbolList } from "./Symbol";

function Image({ suite, number, name, flipped, reversed, height, onClick }) {
  if (flipped) {
    const safeName = name.replace(/ /g, "-");
    const src =
      suite === "groot"
        ? `/GroteArcana/${number}-${safeName}.jpg`
        : `/KleineArcana/${suite}/${suite}-${safeName}.jpg`;
    return (
      <img
        style={reversed ? { transform: "rotate(180deg)" } : {}}
        src={src}
        alt={name}
        height={height}
      />
    );
  } else {
    return (
      <img src="/achterkant.jpg" alt="" height={height} onClick={onClick} />
    );
  }
}

Image.propTypes = {
  number: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  suite: PropTypes.string.isRequired
};

Image.defaultProps = {
  flipped: 1,
  reversed: 0
};

export function CardLink({ suite, name, children }) {
  return <Link to={`/card/${suite}/${name}`}>{children}</Link>;
}

CardLink.propTypes = {
  name: PropTypes.string.isRequired,
  suite: PropTypes.string.isRequired
};

export function Thumbnail({ link, flipped, ...props }) {
  const [isFlipped, setIsFlipped] = React.useState(flipped);

  if (isFlipped) {
    var img = <Image {...props} />;
    if (link) {
      img = <CardLink {...props}>{img}</CardLink>;
    }
    return (
      <div style={{ textAlign: "center" }}>
        {img}
        <br />
        {props.keyword}
      </div>
    );
  } else {
    return <Image {...props} flipped={0} onClick={() => setIsFlipped(true)} />;
  }
}

Thumbnail.propTypes = {
  keyword: PropTypes.string.isRequired,
  link: PropTypes.number,
  ...Image.propTypes
};

Thumbnail.defaultProps = {
  height: "200pt",
  link: 0,
  flipped: 1,
  reversed: 0
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
    <>
      <OptionalInfo
        label="Arcana"
        symbol={props.suite === "groot" ? "Grote Arcana" : "Kleine Arcana"}
      >
        {props.suite === "groot" ? "Groot" : "Klein"}
      </OptionalInfo>
      <OptionalInfo label="Kleur" symbol={props.suite.toLowerCase()}>
        {props.suite !== "groot" && props.suite}
      </OptionalInfo>
      <OptionalInfo label="Nummer" symbol={props.number}>
        {props.number}
      </OptionalInfo>
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
    </>
  );
}
