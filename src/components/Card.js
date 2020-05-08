import React from "react";
import PropTypes from "prop-types";

import { Link } from "react-router-dom";

import { findTerm } from "../db";
import { RawContent } from "./Content";
import { Terms } from "./Term";
import { CardLinks } from "./Reference";

function Image({ suite, number, name, flipped, reversed, height, onClick }) {
  const props = { height, onClick };

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
        {...props}
      />
    );
  } else {
    return <img src="/achterkant.jpg" alt="" {...props} />;
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

export function cardLink({ suite, name }) {
  return `/card/${suite}/${name}`;
}

export function CardLink({ children, ...props }) {
  return <Link to={cardLink(props)}>{children}</Link>;
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
  ) : (
    ""
  );
}

export function CardInfo(props) {
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
          <OptionalInfo label="Nummer" term={props.number}>
            {props.number}
          </OptionalInfo>
          <OptionalInfo label="Kaart" term={props.name}>
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
                : props.comment.map((comment, nr) => (
                    <li key={nr}>{comment}</li>
                  ))}
            </OptionalInfo>
          )}
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
