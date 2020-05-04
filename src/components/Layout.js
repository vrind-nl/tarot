import React from "react";
// import PropTypes from "prop-types";

import { Card } from "./Card";

export function Layout({ title, cards }) {
  return (
    <>
      <h3>{title}</h3>
      <div style={{ display: "flex" }}>
        {cards.map(card => (
          <Card key={card.___id} {...card} />
        ))}
      </div>
    </>
  );
}
