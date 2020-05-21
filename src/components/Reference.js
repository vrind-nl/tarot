import React from "react";

function Ref({ href, children, target }) {
  return (
    <li>
      <a href={href} target={target} rel="noopener noreferrer">
        {children}
      </a>
    </li>
  );
}

Ref.defaultProps = {
  target: "_blank"
};

export function CardLinks({ links }) {
  return (
    <ul>
      {links.map(
        ({ name, url, broken }, nr) =>
          !broken && (
            <Ref key={nr} href={url} target={name}>
              {name}
            </Ref>
          )
      )}
    </ul>
  );
}
