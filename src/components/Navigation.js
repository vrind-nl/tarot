import React from "react";
import { Switch, Route, NavLink } from "react-router-dom";

import { Index } from "../pages/Index";
import { Page } from "../pages/Page";
import { Card, CardByNumber } from "../pages/Card";
import { Reading } from "../pages/Reading";
// import { Quiz } from "../pages/Quiz";
import { Terms } from "../pages/Term";
import { decks } from "./Image";

import "./Navigation.css";

function Link({ name }) {
  return <NavLink to={"/" + name.toLowerCase()}>{name}</NavLink>;
}

function PageLink({ name }) {
  return <NavLink to={"/page/" + name}>{name}</NavLink>;
}

export function Navigation({ setDeck }) {
  return (
    <nav>
      <Link name="Overzicht" />
      <Link name="Begrippen" />
      {/* <NavLink name="Quiz" /> */}
      <Link name="Legging" />
      <PageLink name="Achtergrond" />
      Kaarten:{" "}
      <select onChange={data => setDeck(data.target.value)}>
        {decks.map((deck, nr) => (
          <option key={nr}>{deck}</option>
        ))}
      </select>
    </nav>
  );
}

export function Routes({ deck }) {
  return (
    <Switch>
      <Route path="/overzicht">
        <Index deck={deck} />
      </Route>
      <Route path="/begrippen">
        <Terms />
      </Route>
      <Route path="/legging/:perma?">
        <Reading deck={deck} />
      </Route>
      {/* <Route path="/quiz"> */}
      {/*   <Quiz /> */}
      {/* </Route> */}
      <Route path="/card/number/:seqnr">
        <CardByNumber deck={deck} />
      </Route>
      <Route path="/card/:suite/:name">
        <Card deck={deck} />
      </Route>
      <Route path="/page/:name">
        <Page />
      </Route>
      <Route path="/">
        <Index deck={deck} />
      </Route>
    </Switch>
  );
}
