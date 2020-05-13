export function arabic2roman(num) {
  if (isNaN(num)) return NaN;
  if (num === 0) {
    return "O";
  }
  var digits = String(+num).split(""),
    key = [
      "",
      "C",
      "CC",
      "CCC",
      "CD",
      "D",
      "DC",
      "DCC",
      "DCCC",
      "CM",
      "",
      "X",
      "XX",
      "XXX",
      "XL",
      "L",
      "LX",
      "LXX",
      "LXXX",
      "XC",
      "",
      "I",
      "II",
      "III",
      "IV",
      "V",
      "VI",
      "VII",
      "VIII",
      "IX"
    ],
    roman = "",
    i = 3;
  while (i--) roman = (key[+digits.pop() + i * 10] || "") + roman;
  return Array(+digits.join("") + 1).join("M") + roman;
}

export function roman2arabic(s) {
  if (s === "O") {
    return 0;
  }
  const map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  return [...s].reduce(
    (r, c, i, s) => (map[s[i + 1]] > map[c] ? r - map[c] : r + map[c]),
    0
  );
}
