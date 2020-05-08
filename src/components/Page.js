import React from "react";

import packageInfo from "../../package.json";

export function Page({ title, children }) {
  return (
    <div style={{ margin: "20pt" }}>
      <h1 style={{ paddingTop: "20pt" }}>{title}</h1>
      {children}
      <hr />
      <footer style={{ textAlign: "right", fontSize: "80%" }}>
        &copy; 2020 - Tarot v{packageInfo.version} - Random Rambler
      </footer>
    </div>
  );
}
