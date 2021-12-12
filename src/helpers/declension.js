export default function declension(titles, count) {
  const cases = [2, 0, 1, 1, 1, 2];
  const casesIn = cases[(count % 10 < 5) ? count % 10 : 5];

  return titles[
    (count % 100 > 4 && count % 100 < 20) ? 2 : casesIn
  ];
}
