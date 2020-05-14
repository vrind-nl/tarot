import React from "react";
import PropTypes from "prop-types";

import { Link } from "react-router-dom";

import { findTerm, card_name, card_value } from "../db";
import { RawContent } from "./Content";
import { Terms } from "./Term";
import { CardLinks } from "./Reference";

// import "./Card.css";

function Image({ flipped, reversed, height, onClick, ...card }) {
  const { suite, number, name } = card;
  const props = { height, onClick };

  if (flipped) {
    const safeName = card_name(card).replace(/ /g, "-");
    const src =
      suite === "groot"
        ? `/GroteArcana/${number}-${safeName}.jpg`
        : `/KleineArcana/${suite}/${suite}-${safeName}.jpg`;
    return (
      <img
        className="card"
        style={reversed ? { transform: "rotate(180deg)" } : {}}
        src={src}
        alt={name}
        {...props}
      />
    );
  } else {
    return <img src="/achterkant.jpg" alt="" {...props} />;
  }
}

Image.propTypes = {
  number: PropTypes.string,
  name: PropTypes.string,
  suite: PropTypes.string.isRequired
};

Image.defaultProps = {
  flipped: 1,
  reversed: 0
};

export function cardLink({ suite, ...card }) {
  return `/card/${suite}/${card_name(card)}`;
}

export function CardLink({ children, ...props }) {
  return <Link to={cardLink(props)}>{children}</Link>;
}

CardLink.propTypes = {
  name: PropTypes.string,
  suite: PropTypes.string.isRequired
};

export function Thumbnail({ link, flipped, ...props }) {
  const [isFlipped, setIsFlipped] = React.useState(flipped);

  if (isFlipped) {
    var img = <Image {...props} />;
    if (link) {
      img = <CardLink {...props}>{img}</CardLink>;
    }
    return <div style={{ textAlign: "center" }}>{img}</div>;
  } else {
    return (
      <Image
        {...props}
        flipped={0}
        onClick={e => {
          setIsFlipped(true);
          props.onClick(e, true);
        }}
      />
    );
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

function OptionalInfo({ label, term, children }) {
  term = findTerm(term);
  return children ? (
    <tr>
      <td>{label}: </td>
      <td>
        {children} {term && <RawContent>{` (${term.definition})`}</RawContent>}
      </td>
    </tr>
  ) : null;
}

function getNumerology(card) {
  const value = card_value(card);
  const numerology = Math.floor(value / 10) + (value % 10);
  return (
    <RawContent>{`${value} &rarr; ${numerology}: ${
      findTerm(numerology).definition
    }`}</RawContent>
  );
}

export function CardInfo(props) {
  const numerology = getNumerology(props);
  return (
    <>
      <table>
        <tbody>
          <OptionalInfo
            label="Arcana"
            term={props.suite === "groot" ? "Grote Arcana" : "Kleine Arcana"}
          >
            {props.suite === "groot" ? "Groot" : "Klein"}
          </OptionalInfo>
          <OptionalInfo label="Kleur" term={props.suite.toLowerCase()}>
            {props.suite !== "groot" && props.suite}
          </OptionalInfo>
          <OptionalInfo label="Nummer">{props.number}</OptionalInfo>
          <OptionalInfo label="Kaart" term={props.name}>
            {props.name}
          </OptionalInfo>
          <OptionalInfo label="Kernwoord">{props.keyword}</OptionalInfo>
          <OptionalInfo label="Alias">{props.alias}</OptionalInfo>
          <OptionalInfo label="Steekwoorden">
            {props.keywords.join(", ")}
          </OptionalInfo>
          <OptionalInfo label="Uitnodiging">{props.invitation}</OptionalInfo>
          <OptionalInfo label="Waarschuwing">{props.warning}</OptionalInfo>
          {props.comment && (
            <OptionalInfo label="Opmerking">
              {typeof props.comment === "string"
                ? props.comment
                : props.comment.map((comment, nr) => (
                    <li key={nr}>{comment}</li>
                  ))}
            </OptionalInfo>
          )}
          <OptionalInfo label="Numerologie">{numerology}</OptionalInfo>
        </tbody>
      </table>
      <h3>Begrippen</h3>
      <Terms
        terms={props.symbols.sort().map(name => ({
          name
        }))}
      />
      <h3>Links</h3>
      <CardLinks {...props} />
    </>
  );
}
