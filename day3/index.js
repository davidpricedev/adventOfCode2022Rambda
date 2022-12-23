import * as R from "ramda";
import { inspect, getFileContent } from "../util.js";

const inputFile = "day3/input.txt";

const itemToValue = (item) => {
  // ascii/utf8 values are in order alphabetically, so just need to shift to be based on 1 or 27
  const asciiValue = item.charCodeAt(0);
  const lowerShift = (x) => x - ("a".charCodeAt(0) - 1);
  const upperShift = (x) => x - ("A".charCodeAt(0) - 27);
  const isLowerCase = (x) => x === x.toLowerCase();
  return isLowerCase(item) ? lowerShift(asciiValue) : upperShift(asciiValue);
};

const half = R.divide(R.__, 2);

const splitStringInHalf = (input) => {
  const index = half(R.length(input));
  return R.splitAt(index, input);
};

const priorityValueFromContents = R.pipe(
  splitStringInHalf,
  R.map(R.split("")),
  ([a, b]) => R.intersection(a, b),
  ([x]) => x,
  itemToValue
);

const day3Part1 = R.pipe(
  R.trim,
  R.split("\n"),
  R.map(priorityValueFromContents),
  R.sum
);

const findBadgeItem = ([a, b, c]) => R.intersection(a, R.intersection(b, c));

const findBadgeValue = R.pipe(findBadgeItem, ([x]) => x, itemToValue);

const day3Part2 = R.pipe(
  R.trim,
  R.split("\n"),
  R.splitEvery(3),
  R.map(findBadgeValue),
  R.sum
);

export async function run() {
  const rawFileContent = await getFileContent(inputFile);
  console.log("day3 part1: ", day3Part1(rawFileContent));
  console.log("day3 part2: ", day3Part2(rawFileContent));
}
