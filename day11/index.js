import P from "parsimmon";
import * as R from "ramda";
import _assertPromise from "ramda/src/internal/_assertPromise.js";
import {
  getFileContent,
  tryParse,
  keyBy,
  inspect,
  inspectReducer,
  ipush,
  mergeObjs,
  objSize,
} from "../util.js";

const inputFile = "day11/input.txt";
//const inputFile = "day11/sample.txt";

const sampleMonkey = `Monkey 5:
  Starting items: 60, 94
  Operation: new = old + 5
  Test: divisible by 3
    If true: throw to monkey 1
    If false: throw to monkey 0
`;

const nl = P.string("\n");
const numP = P.regexp(/[0-9]+/).map(Number);
const itemListP = P.sepBy(numP, P.string(", "));
const operatorP = P.alt(P.string("+"), P.string("*"));
const operandP = P.alt(numP, P.string("old"));
const headerLineP = P.seq(P.string("Monkey "), numP, P.string(":")).map(
  ([_label, n]) => ({
    monkeyNum: n,
  }),
);

const itemsLineP = P.seq(
  P.whitespace,
  P.string("Starting items: "),
  itemListP,
).map(([_w, _label, items]) => ({ items }));
const operationLineP = P.seq(
  P.whitespace,
  P.string("Operation: new = "),
  operandP,
  P.whitespace,
  operatorP,
  P.whitespace,
  operandP,
).map(([_w1, _label, operand1, _w2, operator, _w3, operand2]) => ({
  operand1,
  operator,
  operand2,
}));
const testLineP = P.seq(
  P.whitespace,
  P.string("Test: divisible by "),
  numP,
).map(([_w, _label, n]) => ({ divTestNum: n }));
const ifTrueLineP = P.seq(
  P.whitespace,
  P.string("If true: throw to monkey "),
  numP,
).map(([_w, _label, n]) => ({ targetIfTrue: n }));
const ifFalseLineP = P.seq(
  P.whitespace,
  P.string("If false: throw to monkey "),
  numP,
).map(([_w, _label, n]) => ({ targetIfFalse: n }));
const monkeyP = P.seq(
  headerLineP,
  nl.map(() => {}),
  itemsLineP,
  nl.map(() => {}),
  operationLineP,
  nl.map(() => {}),
  testLineP,
  nl.map(() => {}),
  ifTrueLineP,
  nl.map(() => {}),
  ifFalseLineP,
  nl.map(() => {}),
).map(R.reduce((acc, x) => ({ ...acc, ...x }), {}));
const monkeysP = P.sepBy(monkeyP, nl);

const operand = R.curry((operandName, monkey, oldItemValue) =>
  monkey[operandName] === "old" ? oldItemValue : monkey[operandName],
);

const applyRelief = (x) => Math.floor(x / 3);

const applyOperator = R.curry((monkey, oldItemValue) => {
  const a = operand("operand1", monkey, oldItemValue);
  const b = operand("operand2", monkey, oldItemValue);
  return monkey.operator === "*" ? a * b : a + b;
});

const getNextValue = R.curry((monkey, oldItemValue) =>
  R.pipe(applyOperator(monkey), applyRelief)(oldItemValue),
);

const determineTarget = R.curry((monkey, itemValue) =>
  itemValue % monkey.divTestNum === 0
    ? monkey.targetIfTrue
    : monkey.targetIfFalse,
);

const nextData = R.curry((monkey, oldItemValue) => {
  const newItemValue = getNextValue(monkey, oldItemValue);
  return {
    newItemValue,
    targetMonkey: determineTarget(monkey, newItemValue),
  };
});

const distribute = (nextData, monkeyState) => {
  console.log("len: ", nextData.length);
  for (let next of nextData) {
    console.log("applying ", next, ", len: ", nextData.length);
    monkeyState[next.targetMonkey].items.push(next.newItemValue);
  }
  return monkeyState;
};

const runMonkey = (monkeyState, monkeyNum) => {
  const monkey = monkeyState[monkeyNum];
  monkey.itemsInspected = monkey.items.length + (monkey.itemsInspected || 0);
  distribute(R.map(nextData(monkey), monkey.items), monkeyState);
  monkey.items = [];
  return monkeyState;
};

const runRound = (monkeyState) =>
  R.range(0, objSize(monkeyState)).reduce(
    (state, i) => runMonkey(state, i),
    monkeyState,
  );

const runRounds = R.curry((count, startingState) =>
  R.range(0, count).reduce(
    inspectReducer((state, i) => runRound(state)),
    startingState,
  ),
);

const mostActiveMonkeys = R.pipe(
  R.values,
  R.sortBy(R.prop("itemsInspected")),
  R.takeLast(2),
);

const calculateMonkeyBusiness = (monkeyState) => {
  const last2 = mostActiveMonkeys(monkeyState);
  return last2[0].itemsInspected * last2[1].itemsInspected;
};

const part1 = R.pipe(
  tryParse(monkeysP),
  runRounds(20),
  calculateMonkeyBusiness,
);

export async function run() {
  const rawFileContent = await getFileContent(inputFile);
  console.log("part1: ", part1(rawFileContent));
  // console.log("part2: ", part2(rawFileContent));
}
