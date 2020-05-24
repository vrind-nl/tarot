import React from "react";
import { HashRouter as Router } from "react-router-dom";

import { Navigation, Routes } from "./components/Navigation";

export default function App() {
  const [deck, setDeck] = React.useState("Smith Waite");
  return (
    <Router>
      <Navigation setDeck={setDeck} />
      <Routes deck={deck} />
    </Router>
  );
}
