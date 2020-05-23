import React from "react";
import { Switch, Route, NavLink } from "react-router-dom";

import { Index } from "../pages/Index";
import { Page } from "../pages/Page";
import { Card, CardByNumber } from "../pages/Card";
import { Reading } from "../pages/Reading";
// import { Quiz } from "../pages/Quiz";
import { Terms } from "../pages/Term";

import "./Navigation.css";

function Link({ name }) {
  return <NavLink to={"/" + name.toLowerCase()}>{name}</NavLink>;
}

function PageLink({ name }) {
  return <NavLink to={"/page/" + name}>{name}</NavLink>;
}

export function Navigation() {
  return (
    <nav>
      <Link name="Overzicht" />
      <Link name="Begrippen" />
      {/* <NavLink name="Quiz" /> */}
      <Link name="Legging" />
      <PageLink name="Achtergrond" />
    </nav>
  );
}

export function Routes() {
  return (
    <Switch>
      <Route path="/overzicht">
        <Index />
      </Route>
      <Route path="/begrippen">
        <Terms />
      </Route>
      <Route path="/legging/:perma?">
        <Reading />
      </Route>
      {/* <Route path="/quiz"> */}
      {/*   <Quiz /> */}
      {/* </Route> */}
      <Route path="/card/number/:seqnr">
        <CardByNumber />
      </Route>
      <Route path="/card/:suite/:name">
        <Card />
      </Route>
      <Route path="/page/:name">
        <Page />
      </Route>
      <Route path="/">
        <Index />
      </Route>
    </Switch>
  );
}
