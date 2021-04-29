import React from "react";
// import { useParams } from "react-router-dom";
// import { HashLink } from "react-router-hash-link";

import { categories, suite_names } from "../db";
import { cards, cleanRecords, shuffle } from "../db";
import { CardInfo } from "../components/Card";
import { CardImage } from "../components/Image";
import { Page } from "../components/Page";

function Checkbox({ name, value, setValue }) {
  return (
    <div>
      <input
        type="checkbox"
        checked={value}
        onChange={e => setValue(name, e.target.checked)}
      />{" "}
      {name}
    </div>
  );
}

function CheckboxGroup({ names, values, setValue, ...props }) {
  return (
    <div style={{ float: "left", margin: 15 }}>
      {names.map(cat => (
        <Checkbox
          key={cat}
          name={cat}
          value={values[cat]}
          setValue={setValue}
        />
      ))}
    </div>
  );
}

export function Pull({ deck }) {
  const group = [...categories, "ondersteboven"];
  const [settings, setSettings] = React.useState(
    group.concat(suite_names).reduce((obj, name) => {
      obj[name] = true;
      return obj;
    }, {})
  );
  const [card, setCard] = React.useState(pullCard());

  function setValue(name, value) {
    setSettings({ ...settings, [name]: value });
  }

  function pullCard() {
    const query = {
      suite: suite_names.filter(name => settings[name])
      // name: { "!is": rejected_names },
      // number: { "!is": rejected_numbers }
    };
    if (settings["grote arcana"]) {
      query.suite.push("groot");
    }
    var selection = cards(query).get();
    if (!settings.nummerkaarten) {
      selection = selection.filter(
        card =>
          ![
            "Aas",
            "II",
            "III",
            "IV",
            "V",
            "VI",
            "VII",
            "VIII",
            "IX",
            "X"
          ].includes(card.number)
      );
    }
    if (!settings.hofkaarten) {
      selection = selection.filter(
        card => !["Page", "Ridder", "Koningin", "Koning"].includes(card.name)
      );
    }

    return cleanRecords(shuffle(selection))[0];
  }

  return (
    <Page title="Trekking">
      <div style={{ display: "inline-block" }}>
        <CheckboxGroup names={group} values={settings} setValue={setValue} />
        <CheckboxGroup
          names={suite_names}
          values={settings}
          setValue={setValue}
        />
      </div>
      <button onClick={() => setCard(pullCard())}>Trek kaart</button>
      {card ? (
        <>
          <CardImage card={card} />
          <CardInfo {...card} />
        </>
      ) : (
        "Trek een kaart"
      )}
    </Page>
  );
}
