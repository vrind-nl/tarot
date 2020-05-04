import React from "react";

import { HashLink } from "react-router-hash-link";

export function SymbolLink({ name }) {
  return <HashLink to={"/symbolen#" + name}>{name}</HashLink>;
}
