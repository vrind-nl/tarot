import React from "react";

import { useInterval } from "../utils";
import "./Clock.css";

export function Clock({ hours, minutes, seconds, run, size, children }) {
  const middle = size / 2;

  const hour = { length: middle * 0.5, width: 4.4 };
  const minute = { length: middle * 0.7, width: 3 };
  const second = { length: middle * 0.9 };

  return (
    <svg id="clock" viewBox={`0 0 ${size} ${size}`}>
      <g transform={`translate(${middle} ${middle})`} id="hands">
        {children}
        {/* <circle r={middle} /> */}
        <rect
          id="hour"
          x={-hour.width / 2}
          y={-hour.length + hour.width / 2}
          width={hour.width}
          height={hour.length}
          rx="2.5"
          ry="2.55"
          transform={`rotate(${hours * 30} 0 0)`}
        />
        <rect
          id="min"
          x={-minute.width / 2}
          y={-minute.length + minute.width / 2}
          width={minute.width}
          height={minute.length}
          rx="2"
          ry="2"
          transform={`rotate(${minutes * 6} 0 0)`}
        />
        {seconds >= 0 && (
          <line
            id="sec"
            x1="0"
            y1={-second.length + 2}
            x2="0"
            y2="-2"
            transform={`rotate(${seconds * 6} 0 0)`}
          />
        )}
      </g>
    </svg>
  );
}

Clock.defaultProps = {
  hours: 0,
  minutes: 0,
  seconds: 0,
  size: 100,
  run: 0
};

export function RunningClock({ time }) {
  const [clock, setClock] = React.useState({
    hours: time.getHours(),
    minutes: time.getMinutes(),
    seconds: time.getSeconds()
  });

  useInterval(() => {
    const seconds = (clock.seconds + 1) % 60;
    const minutes = seconds === 0 ? (clock.minutes + 1) % 60 : clock.minutes;
    const hours = minutes === 0 ? (clock.hours + 1) % 12 : clock.hours;

    setClock({ hours, minutes, seconds });
  }, 1000);

  return <Clock {...clock} />;
}
