import React from "react";

export function Page({ title, children }) {
  return (
    <div className="content" style={{ marginLeft: "20pt" }}>
      <h1>{title}</h1>
      {children}
      <hr />
      <footer style={{ textAlign: "right", fontSize: "80%" }}>
        &copy; 2020 - Random Rambler
      </footer>
    </div>
  );
}
