import fs from 'fs/promises';
// import * as R from 'ramda';

export const sortFnNumAsc = (a, b) => a - b;
export const sortFnNumDesc = (a, b) => b - a;

export const getFileContent = async (filename) => (await fs.readFile(filename)).toString().trim();

export const inspect = (msg) => (payload) => {
    console.log(`[inspect] ${msg}: `, payload);
    return payload;
};
