import * as R from 'ramda';
import { inspect, getFileContent } from '../util.js';

const inputFile = "day2/input.txt";

const interpretInstruction = (inst) => {
    const instmap = {
        A: "Rock",
        B: "Paper",
        C: "Scissors",
        X: "Rock",
        Y: "Paper",
        Z: "Scissors",
    };
    return instmap[inst];
};

const intrinsicValue = (move) => {
    const valueMap = {
        Rock: 1,
        Paper: 2,
        Scissors: 3,
    };
    return valueMap[move];
};

const roundResultValue = (roundResult) => {
    const resultMap = {
        Win: 6,
        Lose: 0,
        Draw: 3,
    };
    return resultMap[roundResult];
};

const winLoseOrDraw = ({theirMove, myMove}) => {
    const moveResultMap = {
        "Rock,Rock": "Draw",
        "Rock,Paper": "Win",
        "Rock,Scissors": "Lose",
        "Paper,Paper": "Draw",
        "Paper,Scissors": "Win",
        "Paper,Rock": "Lose",
        "Scissors,Scissors": "Draw",
        "Scissors,Rock": "Win",
        "Scissors,Paper": "Lose",
    };
    return moveResultMap[`${theirMove},${myMove}`];
};

const scoreRound = (round) => roundResultValue(winLoseOrDraw(round)) + intrinsicValue(round.myMove);

const convertMovePairToRound = ([theirMove, myMove]) => ({theirMove, myMove});

const lineToRound = R.pipe(
    R.trim(),
    R.split(" "),
    R.map(interpretInstruction),
    convertMovePairToRound
);

const day2Part1 = R.pipe(
    R.trim(),
    R.split("\n"),
    R.map(R.pipe(lineToRound, scoreRound)),
    R.sum
);

export async function run() {
    const rawFileContent = await getFileContent(inputFile);
    console.log("day2 part1: ", day2Part1(rawFileContent));
    // console.log("day2 part2: ", day1Part2(sums));
}