import * as R from "ramda";
import {
  getFileContent,
  inspect,
  inspectReducer,
  ipush,
  mergeObjs,
  objSize,
} from "../util.js";

const inputFile = "day6/input.txt";
const p1Window = 4;
const p2Window = 14;

const window = R.curry((size, array) =>
  R.map(
    (x) => R.slice(x, x + size, array),
    R.range(0, R.length(array) - (size - 1))
  )
);

const areComponentsUnique = (x) =>
  R.pipe(
    R.reduce((acc, x) => ({ ...acc, [x]: 1 }), {}),
    objSize,
    R.equals(x.length)
  )(x);

const part1 = R.pipe(
  R.split(""),
  window(p1Window),
  R.findIndex(areComponentsUnique),
  R.add(p1Window)
);

const part2 = R.pipe(
  R.split(""),
  window(p2Window),
  R.findIndex(areComponentsUnique),
  R.add(p2Window)
);

export async function run() {
  const rawFileContent = await getFileContent(inputFile);
  console.log("part1: ", part1(rawFileContent));
  console.log("part2: ", part2(rawFileContent));
}
