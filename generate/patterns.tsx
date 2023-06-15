import { Position } from './position'

export class Pattern {
  size: number
  cells: number[][]
  maxStage: number
  allCells: Position[] = []

  constructor (size: number, patterString: string) {
    this.size = size
    this.cells = []
    for (let row = 0; row < size; row++) {
      this.cells[row] = []
      for (let column = 0; column < size; column++) {
        this.cells[row][column] = 0
      }
    }
    const obj = JSON.parse(patterString)
    this.maxStage = 0
    for (const [k, v] of Object.entries(obj)) {
      const position = Position.parse(k)
      const stage = v as number
      this.cells[position.row][position.column] = stage
      if (stage > this.maxStage) {
        this.maxStage = stage
      }
    }
  }
  
  useCell(r: number, c: number, s: number) {
    this.cells[r][c] = s
    const index = this.allCells.findIndex(x => x.row===r && x.column===c)
    if (index > -1) {
      this.allCells.splice(index, 1);
    }
  }

  fillRandom(symmetry: "none" | "two_axis" | "four_axis") {
    const maxClues: number[] = []
    maxClues[4] = 6
    maxClues[5] = 9
    maxClues[6] = 16
    maxClues[7] = 21
    maxClues[8] = 25
    maxClues[9] = 36
    this.allCells = []
    for (let row = 0; row < this.size; row++) {
      for (let column = 0; column < this.size; column++) {
        this.cells[row][column] = 0
        this.allCells.push(new Position(row, column))
      }
    }
    let stage = 0;
    while (this.allCells.length > this.size * this.size - maxClues[this.size]) {
      const next = randomElement(this.allCells)
      stage++
      this.maxStage = stage
      this.useCell(next.row, next.column, stage)
      if (symmetry === "two_axis") {
        this.useCell(this.size - next.row - 1, next.column, stage)
        this.useCell(next.row, this.size - next.column - 1, stage)
        this.useCell(this.size - next.row - 1, this.size - next.column - 1, stage)
      }
      if (symmetry === "four_axis") {
        this.useCell(this.size - next.row - 1, next.column, stage)
        this.useCell(next.row, this.size - next.column - 1, stage)
        this.useCell(this.size - next.row - 1, this.size - next.column - 1, stage)
        this.useCell(next.column, next.row, stage)
        this.useCell(next.column, this.size - next.row - 1, stage)
        this.useCell(this.size - next.column - 1, next.row, stage)
        this.useCell(this.size - next.column - 1, this.size - next.row - 1, stage)
      }
    }
  }

  stage(position: Position): number {
    return this.cells[position.row][position.column]
  }

  print() {
    for (let row = this.size - 1; row >= 0; row--) {
      let str = "";
      for (let column = 0; column < this.size; column++) {
        const value = this.cells[row][column]
        str += (value ? value : ".")+ " "
      }
      console.log(str)
    }
  }
}

export const allPatterns: Pattern[][] = []

allPatterns[4] = []
allPatterns[5] = []
allPatterns[6] = []
allPatterns[7] = []
allPatterns[8] = []
allPatterns[9] = []

allPatterns[4].push(new Pattern(4, '{"a1": 1, "d4": 2, "a4": 3, "d1": 4, "b3": 5, "c2": 6}'))

allPatterns[5].push(new Pattern(5, '{"a1": 1, "b2": 2, "c3": 3, "d4": 4, "e5": 5, "b3": 6, "c4": 6, "c2": 7, "d3": 7, "a5": 8, "e1": 9}'))

allPatterns[6].push(new Pattern(6, '{"a2": 1, "b1": 1, "f5": 1, "e6": 1, "a5": 2, "b6": 2, "e1": 2, "f2": 2, "c3": 3, "d4": 3, "d3": 4, "c4": 4, "b2": 5, "b5": 5, "e2": 5, "e5": 5}'))

allPatterns[7].push(new Pattern(7, '{"a4": 1, "b3": 1, "b5": 1, "c2": 1, "c6": 1, "d1": 1, "d7": 1, "e2": 1, "e6": 1, "f3": 1, "f5": 1, "g4": 1, "a1": 2, "g7": 2, "a7": 3, "g1": 4, "c4": 5}'))

allPatterns[8].push(new Pattern(8, '{"b2": 1, "b3": 1, "c2": 1, "c3": 1, "f6": 1, "f7": 1, "g6": 1, "g7": 1, "b6": 2, "b7": 2, "c6": 2, "c7": 2, "f2": 3, "f3": 3, "g2": 3, "g3": 3, "a4": 4, "a5": 4, "d8": 5, "e8": 5, "d1": 6, "e1": 6, "h4": 7, "h5": 7}'))

allPatterns[9].push(new Pattern(9, '{"a1": 1, "a5": 1, "a9": 1, "i1": 1, "i5": 1, "i9": 1, "b2": 1, "b8": 1, "h2": 1, "h8": 1, "e1": 1, "e9": 1, "c4": 1, "c6": 1, "d3": 1, "d7": 1, "f3": 1, "f7": 1, "g4": 1, "g6": 1, "a3": 2, "a7": 2, "c1": 2, "c9": 2, "g1": 2, "g9": 2, "i3": 2, "i7": 2, "d5": 3, "e4": 3, "e6": 3, "f5": 3, "b5": 4, "e2": 4, "e8": 4, "h5": 4}'))

export function randomElement<T>(array: T[]): T {
  const index = Math.floor(Math.random() * array.length)
  return array[index]
}

export function BuildPattern(size: number) {
  const pattern = new Pattern(size, "{}")
  if (size < 5) {
    pattern.fillRandom("none")
  } else if (size < 8){
    pattern.fillRandom("two_axis")
  } else {
    pattern.fillRandom("four_axis")
  }
  return pattern
}
