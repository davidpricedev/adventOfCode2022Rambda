import * as R from 'ramda';
import { sortFnNumAsc, getFileContent } from '../util.js';

const inputFile = "day1/input.txt";

const day1Part1 = R.reduce(R.max, 0);

const day1Part2 = R.pipe(R.sort(sortFnNumAsc), R.slice(-3, Infinity), R.sum)

const eachElfContents = R.pipe(R.trim, R.split("\n"), R.map(Number), R.sum);

const caloriesByElf = R.pipe(R.trim, R.split("\n\n"), R.map(eachElfContents));

export async function run() {
    const rawFileContent = await getFileContent(inputFile);
    const sums = caloriesByElf(rawFileContent);
    console.log("day1 part1: ", day1Part1(sums));
    console.log("day1 part2: ", day1Part2(sums));
}
