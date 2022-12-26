import fs from "fs/promises";
import * as R from "ramda";

export const sortFnNumAsc = (a, b) => a - b;
export const sortFnNumDesc = (a, b) => b - a;

export const getFileContent = async (filename) =>
  (await fs.readFile(filename)).toString();

// for debugging in pipe/compose
export const inspect = (msg) => (payload) => {
  console.log(`[inspect] ${msg}: `, payload);
  return payload;
};

// for debugging a reducer
export const inspectReducer = (reducerFn) => (acc, x) => {
  console.log("acc: ", acc, ", x: ", x);
  const retval = reducerFn(acc, x);
  console.log("next: ", retval);
  return retval;
};

// for debugging a mapper
export const inspectMapper = (mapFn) => (x) => {
  console.log("x: ", x);
  const retval = mapFn(x);
  console.log("return value: ", retval);
  return retval;
};

// merge an array of objects into a single object
export const mergeObjs = R.reduce((acc, x) => ({ ...acc, ...x }), {});

// immutable push
export const ipush = R.curry((newItem, array) => [...array, newItem]);

export const objSize = R.pipe(Object.keys, R.length);

/** convert array to hash map using fn to extract a key */
export const keyBy = (fn) => (array) =>
  R.reduce((acc, x) => ({ ...acc, [fn(x)]: x }), {});

/** provide a point-free parsimmon tryparse function */
export const tryParse = (p) => (x) => p.tryParse(x);
