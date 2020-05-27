import React from "react";

import { Clock } from "../components/Clock";
import { Page } from "../components/Page";
import { Content } from "../components/Content";

const lunarMonth = 29.53059;

function getJulian(date) {
  return date / 86400000 - date.getTimezoneOffset() / 1440 + 2440587.5;
}

// http://www.ben-daglish.net/moon.shtml
function moonDay(today) {
  var GetFrac = function(fr) {
    return fr - Math.floor(fr);
  };
  var thisJD = getJulian(today);
  var year = today.getFullYear();
  var degToRad = 3.14159265 / 180;
  var K0, T, T2, T3, J0, F0, M0, M1, B1, oldJ;
  K0 = Math.floor((year - 1900) * 12.3685);
  T = (year - 1899.5) / 100;
  T2 = T * T;
  T3 = T * T * T;
  J0 = 2415020 + 29 * K0;
  F0 =
    0.0001178 * T2 -
    0.000000155 * T3 +
    (0.75933 + 0.53058868 * K0) -
    (0.000837 * T + 0.000335 * T2);
  M0 =
    360 * GetFrac(K0 * 0.08084821133) +
    359.2242 -
    0.0000333 * T2 -
    0.00000347 * T3;
  M1 =
    360 * GetFrac(K0 * 0.07171366128) +
    306.0253 +
    0.0107306 * T2 +
    0.00001236 * T3;
  B1 =
    360 * GetFrac(K0 * 0.08519585128) +
    21.2964 -
    0.0016528 * T2 -
    0.00000239 * T3;
  var phase = 0;
  var jday = 0;
  while (jday < thisJD) {
    var F = F0 + 1.530588 * phase;
    var M5 = (M0 + phase * 29.10535608) * degToRad;
    var M6 = (M1 + phase * 385.81691806) * degToRad;
    var B6 = (B1 + phase * 390.67050646) * degToRad;
    F -= 0.4068 * Math.sin(M6) + (0.1734 - 0.000393 * T) * Math.sin(M5);
    F += 0.0161 * Math.sin(2 * M6) + 0.0104 * Math.sin(2 * B6);
    F -= 0.0074 * Math.sin(M5 - M6) - 0.0051 * Math.sin(M5 + M6);
    F += 0.0021 * Math.sin(2 * M5) + 0.001 * Math.sin(2 * B6 - M6);
    F += 0.5 / 1440;
    oldJ = jday;
    jday = J0 + 28 * phase + Math.floor(F);
    phase++;
  }

  return thisJD - oldJ;
}

function moonPhase(time) {
  return moonDay(time) / lunarMonth;
}

export function Time() {
  const [date, setDate] = React.useState(new Date());
  // const dummy = new Array(8);
  const moons = Array.from(new Array(8), (x, nr) => `/moon/1f31${nr + 1}.png`);
  // const moons = new Array(8).map((x, nr) => "X");
  const size = 200,
    middle = size / 2,
    moonSize = 20,
    margin = moonSize * 1.5;

  return (
    <Page title="Zon, maan en sterrenbeelden">
      <p>
        Het onderstaande jaarwiel toont de{" "}
        <a href="https://tallsay.com/page/4294975342/wicca-het-jaarwiel-en-keltische-seizoensvieringen">
          Keltische feestdagen
        </a>{" "}
        en de verschillende{" "}
        <a href="https://www.sterrenbeelden.nu/">sterrenbeelden</a>. Daaromheen
        staan de fasen van de maan. De kleine wijzer toont de datum in het jaar.
        De grote wijzer toons de datum in de maancyclus.
      </p>
      <input
        type="date"
        value={date.toISOString().slice(0, 10)}
        onChange={event => {
          console.log(event.target.value);
          setDate(new Date(event.target.value));
        }}
      />
      <button
        style={{ marginLeft: "10pt" }}
        onClick={() => setDate(new Date())}
      >
        Vandaag
      </button>
      {/* <Clock hours={3} minutes={30} seconds={45} /> */}
      <Clock
        hours={date.getMonth() + date.getDate() / 30.5 + 0.25}
        minutes={moonPhase(date) * 60}
        seconds={-1}
        size={size}
      >
        <image
          href="/jaarwiel.jpg"
          x={-middle + margin}
          y={-middle + margin}
          height={size - 2 * margin}
          width={size - 2 * margin}
        />
        {moons.map((href, nr) => (
          <image
            key={nr}
            href={href}
            x="-10"
            y={-middle + 5}
            width={moonSize}
            transform={` rotate(${nr * 45} 0 0) rotate(${nr * -45} 0 ${-middle +
              5 +
              moonSize / 2})`}
          />
        ))}
      </Clock>
      {/* <RunningClock time={date} /> */}
      <Content file="jaarwiel.html" />
    </Page>
  );
}
