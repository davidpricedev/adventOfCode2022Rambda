import * as R from 'ramda';
import { getFileContent, inspect, inspectReducer, ipush, mergeObjs } from '../util.js';

const inputFile = "day5/input.txt";

/*
Data shape:

type Move = { count: number, fromStack: number, toStack: number };
type Stack = [];
type State = { [stackName: number]: Stack }
*/

const cleanStateEntry = R.pipe(
  R.reduce((acc, x) => [" ", "[", "]"].includes(x) ? acc: x, ""),
);

const parseStateLine = R.pipe(
  R.split(""),
  R.splitEvery(4),
  R.map(cleanStateEntry),
);

const applyStateLine = (state, stateLine) => {
  const updates = mergeObjs(stateLine.map((x, i) => R.objOf(`${i+1}`, x ? ipush(x, state[i+1]) : state[i+1])));
  return { ...state, ...updates }
};

const buildState = ([firstLine, ...stateLines]) => {
  const state = R.pipe(R.map((x) => ({ [x]: [] })), mergeObjs)(firstLine);
  return R.reduce(applyStateLine, state, stateLines);
};

const parseState = R.pipe(
  R.split("\n"),
  R.reverse,
  R.map(parseStateLine),
  buildState,
);

const parseMoveLine = R.pipe(
  R.split(" "),
  ([/*move*/, count, /*from*/, fromStack, /*to*/, toStack]) => ({ count, fromStack, toStack }),
);

const parseMoves = R.pipe(
  R.trim,
  R.split("\n"),
  R.map(parseMoveLine),
);

const applyMove = (state, { count, fromStack, toStack}) => {
  const [a, b] = R.splitAt(-1 * count, state[fromStack]);
  return {
    ...state,
    [fromStack]: a,
    [toStack]: [...state[toStack], ...R.reverse(b)],
  };
};

const applyMoves = ({ state, moves }) => R.reduce(inspectReducer(applyMove), state, moves);

const parseFile = R.pipe(
  R.split("\n\n"),
  ([rawState, rawMoves]) => ({ state: parseState(rawState), moves: parseMoves(rawMoves) }),
)

const day5Part1 = R.pipe(
  parseFile,
  applyMoves,
  R.mapObjIndexed((v, k, o) => R.last(v)),
);

export async function run() {
    const rawFileContent = await getFileContent(inputFile);
    console.log("day5 part1: ", day5Part1(rawFileContent));
    // console.log("day5 part2: ", day5Part2(rawFileContent));
}
