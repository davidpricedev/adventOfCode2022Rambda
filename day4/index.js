import * as R from "ramda";
import { sortFnNumAsc, getFileContent, inspect } from "../util.js";

const inputFile = "day4/input.txt";

/*
Data Shape:

type Range = { min: number, max, number };
type RangePair = { a: Range, b: Range };
*/

const boolAsCountable = (x) => (x ? 1 : 0);

const isRangeAContainedInRangeB = (a, b) => {
  return b.min <= a.min && a.max <= b.max;
};

const doesRangeAOverlapWithRangeB = (a, b) => {
  return b.min <= a.max && a.min <= b.max;
};

const hasFullOverlap = ({ a, b }) =>
  isRangeAContainedInRangeB(a, b) || isRangeAContainedInRangeB(b, a);

const hasAnyOverlap = ({ a, b }) =>
  doesRangeAOverlapWithRangeB(a, b) || doesRangeAOverlapWithRangeB(b, a);

const parseRange = R.pipe(R.split("-"), R.map(Number), ([a, b]) => ({
  min: a,
  max: b,
}));

const lineToPair = R.pipe(
  R.trim,
  R.split(","),
  R.map(parseRange),
  ([a, b]) => ({ a, b })
);

const day4Part1 = R.pipe(
  R.trim,
  R.split("\n"),
  R.map(R.pipe(lineToPair, hasFullOverlap, boolAsCountable)),
  R.sum
);

const day4Part2 = R.pipe(
  R.trim,
  R.split("\n"),
  R.map(R.pipe(lineToPair, hasAnyOverlap, boolAsCountable)),
  R.sum
);

export async function run() {
  const rawFileContent = await getFileContent(inputFile);
  console.log("day4 part1: ", day4Part1(rawFileContent));
  console.log("day4 part2: ", day4Part2(rawFileContent));
}
