import React from "react";
import { Switch, Route, Link } from "react-router-dom";

import { Home } from "../pages/Home";
import { Card } from "../pages/Card";
import { Symbols } from "../pages/Symbol";

function NavLink({ name }) {
  return (
    <li className="pure-menu-item">
      <Link className="pure-menu-link" to={"/" + name.toLowerCase()}>
        {name}
      </Link>
    </li>
  );
}

export function Navigation() {
  return (
    <nav className="pure-menu pure-menu-horizontal">
      <NavLink name="Overzicht" />
      <NavLink name="Symbolen" />
    </nav>
  );
}

export function Routes() {
  return (
    <Switch>
      <Route path="/overzicht">
        <Home />
      </Route>
      <Route path="/symbolen">
        <Symbols />
      </Route>
      <Route path="/card/:suite/:name">
        <Card />
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  );
}
