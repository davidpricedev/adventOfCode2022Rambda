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

// merge an array of objects into a single object
export const mergeObjs = R.reduce((acc, x) => ({ ...acc, ...x }), {});

// immutable push
export const ipush = R.curry((newItem, array) => [...array, newItem]);

export const objSize = R.pipe(Object.keys, R.length);
