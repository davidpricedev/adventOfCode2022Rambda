import P from "parsimmon";
import * as R from "ramda";
import assert from "node:assert";
import _assertPromise from "ramda/src/internal/_assertPromise.js";
import {
  getFileContent,
  inspect,
  inspectReducer,
  ipush,
  mergeObjs,
  objSize,
} from "../util.js";

const inputFile = "day11/input.txt";

const sampleMonkey = `Monkey 5:
  Starting items: 60, 94
  Operation: new = old + 5
  Test: divisible by 3
    If true: throw to monkey 1
    If false: throw to monkey 0
`;

const nl = P.string("\n");
const eatnl = (p) => P.seq(p, nl).map(([r, _w]) => r);
const numP = P.regexp(/[0-9]+/).map(Number);
const itemListP = P.sepBy(numP, P.string(", "));
const operatorP = P.alt(P.string("+"), P.string("*"));
const operandP = P.alt(numP, P.string("old"));
const headerLineP =
  P.seq(P.string("Monkey "), numP, P.string(":")).map(([_label, n]) => ({
    monkeyNum: n,
  }));

const itemsLineP =
  P.seq(P.whitespace, P.string("Starting items: "), itemListP).map(
    ([_w, _label, items]) => ({ items })
  );
const operationLineP =
  P.seq(
    P.whitespace,
    P.string("Operation: new = "),
    operandP,
    P.whitespace,
    operatorP,
    P.whitespace,
    operandP
  ).map(([_w1, _label, operand1, _w2, operator, _w3, operand2]) => ({
    operand1,
    operator,
    operand2,
  }));
const testLineP =
  P.seq(P.whitespace, P.string("Test: divisible by "), numP).map(
    ([_w, _label, n]) => ({ divTestNum: n })
  );
const ifTrueLineP =
  P.seq(P.whitespace, P.string("If true: throw to monkey "), numP).map(
    ([_w, _label, n]) => ({ targetIfTrue: n })
  );
const ifFalseLineP =
  P.seq(P.whitespace, P.string("If false: throw to monkey "), numP).map(
    ([_w, _label, n]) => ({ targetIfFalse: n })
  );
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

const testParser = () => {
  assert.equal(60, numP.tryParse("60"));
  const result = itemListP.tryParse("60, 94");
  assert.equal(60, result[0]);
  assert.equal(94, result[1]);
  const result2 = itemListP.tryParse("60");
  assert.equal(60, result2[0]);
  assert.equal("+", operatorP.tryParse("+"));
  assert.equal("*", operatorP.tryParse("*"));
  assert.equal("old", operandP.tryParse("old"));
  assert.equal(5, operandP.tryParse("5"));
  console.log(operationLineP.tryParse("  Operation: new = old + 5"));
  console.log(monkeyP.tryParse(sampleMonkey));
};

export async function run() {
  const rawFileContent = await getFileContent(inputFile);
  testParser();
  // console.log("part1: ", part1(rawFileContent));
  // console.log("part2: ", part2(rawFileContent));
}
