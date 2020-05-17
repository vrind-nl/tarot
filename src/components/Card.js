import React from "react";
import PropTypes from "prop-types";

import { Link } from "react-router-dom";

import { findTerm, cardValue, cardImg, cardLink } from "../db";
import { RawContent } from "./Content";
import { Terms } from "./Term";
import { CardLinks } from "./Reference";

// import "./Card.css";

export function CardImage({ reversed, ...props }) {
  return (
    <img
      className="card"
      style={reversed ? { transform: "rotate(180deg)" } : {}}
      src={cardImg(props)}
      alt={props.name}
      {...props}
    />
  );
}

function FlipImage({ flipped, ...props }) {
  return flipped ? (
    <CardImage {...props} />
  ) : (
    <img src="/achterkant.jpg" alt="Klik om te draaien" {...props} />
  );
}

FlipImage.propTypes = {
  number: PropTypes.string,
  name: PropTypes.string,
  suite: PropTypes.string.isRequired
};

FlipImage.defaultProps = {
  flipped: 1,
  reversed: 0
};

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
    var img = <FlipImage {...props} />;
    if (link) {
      img = <CardLink {...props}>{img}</CardLink>;
    }
    return <div style={{ textAlign: "center" }}>{img}</div>;
  } else {
    return (
      <FlipImage
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
  ...FlipImage.propTypes
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
  var value = cardValue(card);
  const numerology = Math.floor(value / 10) + (value % 10);
  if (value !== numerology) {
    value = `${value} &rarr; ${numerology}`;
  }
  return (
    <RawContent>{`${value}: ${findTerm(numerology).definition}`}</RawContent>
  );
}

export function CardInfo(props) {
  const numerology = getNumerology(props);
  var { name } = props;
  var nameDef = name && findTerm(name.toLowerCase());
  if (nameDef) {
    name += ` (${nameDef.definition})`;
  }

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
            {name}
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
