import React from "react";

const base = {
  "Pictorial Key to the Tarot (Eng)":
    "https://en.wikisource.org/wiki/The_Pictorial_Key_to_the_Tarot#",
  "Tarot Stap voor Stap": "https://tarotstapvoorstap.nl/tarotkaarten/",
  Catharinaweb: "https://www.catharinaweb.nl/tarot/tarot/",
  "Kaart en Sterren": "http://www.kaartensterren.nl/pagina's tarotkaarten/",
  "Le Tarot": "http://www.letarot.nl/",
  SpiriDoc: "http://www.spiridoc.nl/grotearcana/",
  Orakels: "https://www.orakels.net/tarot/oud-engels/"
};

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
            <Ref key={nr} href={(base[name] || "") + url} target={name}>
              {name}
            </Ref>
          )
      )}
    </ul>
  );
}
