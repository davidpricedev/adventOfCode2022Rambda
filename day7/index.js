import * as R from "ramda";
import {
  getFileContent,
  inspect,
  inspectReducer,
  ipush,
  mergeObjs,
  objSize,
} from "../util.js";

const inputFile = "day7/input.txt";
// const inputFile = "day7/sample.txt";

/*
  type Structure = {
    root: Dir,
    dirStack: Dir[],
  }
  type Dir = {
    name: string,
    children: Entry[],
    directSize: number,
    totalSize: number,
    fullPath: string,
  }
  type File = {
    name: string,
    size: number,
  }
  type Entry = Dir | File;
*/

const emptyStructure = () => {
  const root =  { name: "/", children: [], directSize: 0, fullPath: "/", type: "D" };
  return { root, dirStack: [], allDirs: [root] };
};

const changeDir = (structure, line) => {
  const [_$, _cd, name] = line.split(" ");
  if (name === "..") {
    structure.dirStack.pop();
  } else if (name === "/") {
    structure.dirStack = [structure.root];
  } else {
    const newCurdir = R.find(R.propEq("name", name), R.last(structure.dirStack).children);
    if (newCurdir) {
      structure.dirStack.push(newCurdir);
    }
  }
  return structure;
};

const addDir = (structure, line) => {
  const [_dir, name ] = line.split(" ");
  const { dirStack } = structure;
  const curdir = R.last(dirStack);
  const newDir = { name, directSize: 0, children: [], fullPath: `${curdir.fullPath}/${name}`, type: "D" }
  curdir.children.push(newDir);
  structure.allDirs.push(newDir);
  return structure;
};

const addFile = (structure, line) => {
  const [size, name] = line.split(" ");
  const { dirStack } = structure;
  const curdir = R.last(dirStack);
  curdir.children.push({ name, size: Number(size), type: "F" });
  curdir.directSize += Number(size);
  return structure;
};

const handleLine = (structure, line) => {
  // console.log("structure: ", structure, ", line: ", line);
  if (line.startsWith("$ cd")) {
    return changeDir(structure, line);
  } else if (line.startsWith("dir")) {
    return addDir(structure, line);
  } else if (!line.startsWith("$")) {
    return addFile(structure, line);
  } else {
    // $ ls - no need to do anything
    return structure;
  }
};

const calculateNestedSize = R.pipe(
  R.filter((x) => x.type === "D"),
  R.map((x) => calculateTotalSize(x)),
  R.sum,
)

const calculateTotalSize = (dir) => {
  if (!dir.totalSize) {
    dir.totalSize = dir.directSize + calculateNestedSize(dir.children);
  }

  return dir.totalSize;
};

const part1 = R.pipe(
  R.split("\n"),
  R.reduce(handleLine, emptyStructure()),
  (structure) => { calculateTotalSize(structure.root); return structure; },
  x => x.allDirs,
  R.map(x => x.totalSize),
  R.filter(x => x <= 100000),
  R.sum
);

export async function run() {
  const rawFileContent = await getFileContent(inputFile);
  console.log("part1: ", part1(rawFileContent));
  // console.log("part2: ", part2(rawFileContent));
}
