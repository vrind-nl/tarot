import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function Image({ suite, number, name, height }) {
  name = name.replace(/ /g, "-");
  const src =
    suite === "groot"
      ? `/GroteArcana/${number}-${name}.jpg`
      : `/KleineArcana/${suite}/${suite}-${name}.jpg`;
  return <img src={src} alt={name} height={height} />;
}

Image.propTypes = {
  number: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  suite: PropTypes.string.isRequired
};

Image.defaultProps = {
  height: "200pt"
};

export function CardLink({ name, children }) {
  return <Link to={"/card/" + name}>{children}</Link>;
}

CardLink.propTypes = {
  ___id: PropTypes.string.isRequired
};

export function Card(props) {
  return (
    <div style={{ textAlign: "center" }}>
      <CardLink {...props}>
        <Image {...props} />
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

export function CardInfo(props) {
  return (
    <div className="pure-g">
      <div className="pure-u-1-5" style={{ textAlign: "center" }}>
        <Image {...props} />
        <br />
        {props.keyword}
      </div>
      <div className="pure-u-4-5">
        <div className="pure-u-1-5">Arcana: </div>
        <div className="pure-u-4-5">
          {props.suite === "groot" ? "Groot" : "Klein"}
        </div>
        <div className="pure-u-1-5">Nummer: </div>
        <div className="pure-u-4-5">{props.keywords.join(", ")}</div>
        {props.suite !== "groot" && (
          <>
            <div className="pure-u-1-5">Kleur: </div>
            <div className="pure-u-4-5">{props.suite}</div>
          </>
        )}
        <div className="pure-u-1-5">Kernwoorden: </div>
        <div className="pure-u-4-5">{props.keywords.join(", ")}</div>
      </div>
    </div>
  );
}
