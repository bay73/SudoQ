import { Position } from './position'
import { Cell } from './cell'
import { Area } from './area'
import { Grid } from './grid'
import { Strategies } from './strategies'
import { existsSync, writeFileSync } from 'fs';

class Pattern {
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
    maxClues[6] = 15
    maxClues[7] = 20
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

function applyAnyStrategy(grid: Grid): Cell | undefined {
  for (let i=0; i < Strategies.length; i++) {
    const cell = Strategies[i](grid)
    if (cell != undefined) {
      // console.log(cell.position.coordinate() + " -> " + cell.value + " " + Strategies[i].name)
      return cell
    }
  }
  return undefined
}

function solve(grid: Grid) {
  let result = true
  while(result) {
    result = (applyAnyStrategy(grid) !== undefined)
  }
}

function putRandom(grid: Grid, pattern: Pattern, stage: number): Grid | undefined {
  if (stage > pattern.maxStage) {
    return undefined
  }
  if (grid.findEmptyCell() === undefined) {
    const resultGrid = new Grid(grid.size, grid.areasSource)
    for (let row = grid.size - 1; row >= 0; row--) {
      let str = "";
      for (let column = 0; column < grid.size; column++) {
        const position = new Position(row, column)
        const value = grid.cell(position).value
        if (pattern.stage(position) != 0 && pattern.stage(position) <= stage && value != null) {
          resultGrid.setValue(position, value)
        }
      }
    }
    return resultGrid
  }
  const result = grid.tryCells(function (cell: Cell): Grid | undefined {
    if (cell.value === null && pattern.stage(cell.position) === stage) {
      if (cell.allowedValues.length === 0) {
        return undefined
      } else {
        let allowedValues = cell.allowedValues
        while (allowedValues.length > 0) {
          const index = Math.floor(Math.random() * allowedValues.length)
          const randomValue = allowedValues[index]
          const newGrid = grid.copy()
          // console.log(cell.position.coordinate() + "->" + randomValue + " random")
          newGrid.setValue(cell.position, randomValue)
          solve(newGrid)
          const result = putRandom(newGrid, pattern, stage)
          if (result !== undefined) {
            return result
          } else {
            allowedValues.splice(index, 1);
          }
        }
      }
    }
    return undefined
  })
  if (result !== undefined) {
    return result
  }
  return putRandom(grid, pattern, stage + 1)
}

const allGrids: Grid[][] = []

allGrids[4] = []
allGrids[5] = []
allGrids[6] = []
allGrids[7] = []
allGrids[8] = []
allGrids[9] = []

allGrids[4].push(new Grid(4, [["a4", "b4", "a3", "b3"],["c4", "d4", "c3", "d3"],["a2", "b2", "a1", "b1"],["c2", "d2", "c1", "d1"]]))

allGrids[5].push(new Grid(5, [["a1","a2","a3","a4","b2"],["b1","c1","d1","d2","e1"],["a5","b4","b5","c5","d5"],["d4","e2","e3","e4","e5"],["b3","c2","c3","c4","d3"]]))
allGrids[5].push(new Grid(5, [["a5", "b5", "a4", "b4", "a3"],["c5", "d5", "e5", "d4", "e4"],["c4", "c3", "b3", "d3", "c2"],["e3", "e2", "d2", "d1", "e1"],["a2", "b2", "a1", "b1", "c1"]]))

allGrids[6].push(new Grid(6, [["a1", "b1", "c1", "a2", "b2", "c2"],["a3", "b3", "c3", "a4", "b4", "c4"],["a5", "b5", "c5", "a6", "b6", "c6"],["d1", "e1", "f1", "d2", "e2", "f2"],["d3", "e3", "f3", "d4", "e4", "f4"],["d5", "e5", "f5", "d6", "e6", "f6"]]))

allGrids[7].push(new Grid(7, [["a1", "b1", "c1", "a2", "b2", "c2", "d2"],["d1", "e1", "f1", "g1", "e2", "f2", "g2"],["a3", "b3", "c3", "a4", "b4", "c4", "d4"],["d3", "e3", "f3", "g3", "e4", "f4", "g4"],["a5", "b5", "c5", "a6", "b6", "c6", "d6"],["d5", "e5", "f5", "g5", "e6", "f6", "g6"],["a7", "b7", "c7", "d7", "e7", "f7", "g7"]]))

allGrids[7].push(new Grid(7, [["a7", "b7", "c7", "d7", "a6", "b6", "c6"],["e7", "f7", "g7", "f6", "g6", "f5", "g5"],["d6", "d5", "a5", "b5", "c5", "a4", "b4"],["e6", "e5", "e4", "c4", "d4", "c3", "c2"],["f4", "g4", "f3", "d3", "e3", "g3", "d2"],["a3", "b3", "a2", "b2", "a1", "b1", "c1"],["e2", "f2", "g2", "e1", "d1", "f1", "g1"]]))

allGrids[8].push(new Grid(8, [["a1", "b1", "c1", "d1", "a2", "b2", "c2", "d2"],["e1", "f1", "g1", "h1", "e2", "f2", "g2", "h2"],["a3", "b3", "c3", "d3", "a4", "b4", "c4", "d4"],["e3", "f3", "g3", "h3", "e4", "f4", "g4", "h4"],["a5", "b5", "c5", "d5", "a6", "b6", "c6", "d6"],["e5", "f5", "g5", "h5", "e6", "f6", "g6", "h6"],["a7", "b7", "c7", "d7", "a8", "b8", "c8", "d8"],["e7", "f7", "g7", "h7", "e8", "f8", "g8", "h8"]]))

allGrids[9].push(new Grid(9, [["a9", "b9", "c9", "a8", "b8", "c8", "a7", "b7", "c7"],["d9", "e9", "f9", "d8", "e8", "f8", "d7", "e7", "f7"],["g9", "h9", "i9", "g8", "h8", "i8", "g7", "h7", "i7"],["a6", "b6", "c6", "a5", "b5", "c5", "a4", "b4", "c4"],["d6", "e6", "f6", "d5", "e5", "f5", "d4", "e4", "f4"],["g6", "h6", "i6", "g5", "h5", "i5", "g4", "h4", "i4"],["a3", "b3", "c3", "a2", "b2", "c2", "a1", "b1", "c1"],["d3", "e3", "f3", "d2", "e2", "f2", "d1", "e1", "f1"],["g3", "h3", "i3", "g2", "h2", "i2", "g1", "h1", "i1"]]))

function setClues(grid: Grid, clues: string) {
  const obj = JSON.parse(clues)
  for (const [k, v] of Object.entries(obj)) {
    grid.setValue(Position.parse(k), v as number)
  }
}

/*
const gridToSolve = grid9x9.copy().setClues('{"c9":7, "f9":3, "i9":9, "b8":5, "e8":4, "h8":8, "a7":3, "d7":5, "g7":7, "c6":1, "f6":6, "i6":4, "b5":3, "h5":1, "a4":7, "d4":4, "g4":3, "c3":3, "f3":4, "i3":6, "b2":2, "e2":5, "h2":4, "a1":1, "d1":7, "g1":2}')
gridToSolve.print()
console.log('solving')
solve(gridToSolve)
gridToSolve.print()
*/

/*
const gridToSolve = grid4x4.copy().setClues('{"a4":1, "b3":2, "c2":3, "d4":4}')
gridToSolve.print()
console.log('solving')
solve(gridToSolve)
gridToSolve.print()
*/


const allPatterns: Pattern[][] = []

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

function tryAll(grid: Grid, baseComplexity: number, complexity: number[][]) {
  if (baseComplexity > 7) return
  for (let row = 0; row < grid.size; row++) {
    for (let column = 0; column < grid.size; column++) {
      const position = new Position(row, column)
      const cell: Cell = grid.cell(position)
      if (cell.value === null && cell.allowedValues.length === 1) {
        const value = cell.allowedValues[0]
        const newGrid = grid.copy()
        newGrid.setValue(position, value)
        if(complexity[row][column] > baseComplexity*3) {
          complexity[row][column] = baseComplexity*3
        }
        tryAll(newGrid, baseComplexity*3, complexity)
      }
    }
  }
  for (let a = 0; a < grid.areas.length; a++) {
    const area = grid.areas[a]
    for (let v = 1; v <= grid.size; v++) {
      const cells = area.findCellsFor(v)
      if (cells.length === 1) {
        const position = cells[0].position
        const newGrid = grid.copy()
        newGrid.setValue(position, v)
        if(complexity[position.row][position.column] > baseComplexity*2) {
          complexity[position.row][position.column] = baseComplexity*2
        }
        tryAll(newGrid, baseComplexity*2, complexity)
      }
    }
  }
}


function allComplexities(grid: Grid) {
  const complexity: number[][] = []
  for (let row = 0; row < grid.size; row++) {
    complexity[row] = []
    for (let column = 0; column < grid.size; column++) {
      complexity[row][column] = 1000
    }
  }

  tryAll(grid, 1, complexity)
  
  return complexity
}

function chooseGoalAndStringify(grid: Grid): Record<string, any> | undefined {
  const complexities = allComplexities(grid)
  const solution = grid.copy()
  solve(solution)

  grid.print()
  console.log("------------")
  
  const goals: Position[] = []
  
  for (let row = grid.size - 1; row >= 0; row--) {
    for (let column = 0; column < grid.size; column++) {
      const c = complexities[row][column]
      if (c > 3 && c < 1000) {
        goals.push(new Position(row, column))
      }
    }
  }
  if (goals.length > 0) {
    const timeMultiplier: number[] = []
    timeMultiplier[4] = 2.
    timeMultiplier[5] = 3.5
    timeMultiplier[6] = 6.
    timeMultiplier[7] = 8.1
    timeMultiplier[8] = 12.2
    timeMultiplier[9] = 15.3
    const index = Math.floor(Math.random() * goals.length)
    const goal = goals[index]
    const goalValue = solution.cell(goal).value
    const complexity = Math.floor(complexities[goal.row][goal.column] * timeMultiplier[grid.size])
   console.log(goal.coordinate(), goalValue, complexity)
    
    const result: Record<string, any> = {}
    result["size"] = grid.size
    for (let row = grid.size - 1; row >= 0; row--) {
      for (let column = 0; column < grid.size; column++) {
        const position = new Position(row, column)
        const cell: Cell = grid.cell(position)
        if (cell.value) {
          result[position.coordinate()] = cell.value
        }
      }
    }
    result["areas"] = grid.areasSource
    result["goal"] = goal.coordinate()
    result["goalValue"] = goalValue
    result["medianTime"] = complexity
    
    return result
  } else {
    return undefined
  }
}

/*
const randomGrid = putRandom(grid4x4.copy(), pattern4x4, 1);

if (randomGrid !== undefined) {
  const result = chooseGoalAndStringify(randomGrid)
  console.log(result)
}
*/

function randomElement<T>(array: T[]): T {
  const index = Math.floor(Math.random() * array.length)
  return array[index]
}

class Data {
  data: Record<string, any>[]
  
  constructor() {
    this.data = []
  }
}

const data = new Data()

for (let size=4;size<10;size++) {
  const grid = randomElement(allGrids[size])
  const pattern = new Pattern(size, "{}")
  if (size < 5) {
    pattern.fillRandom("none")
  } else if (size < 8){
    pattern.fillRandom("two_axis")
  } else {
    pattern.fillRandom("four_axis")
  }

  let generated = false
  while (!generated) {
    const randomGrid = putRandom(grid.copy(), pattern, 1);

    if (randomGrid !== undefined) {
      const result = chooseGoalAndStringify(randomGrid)
      if (result !== undefined) {
        data.data.push(result)
        generated = true
      }
    }
  }
}


let today = new Date();
let saved = false
while(!saved) {
  const fileName = "public/data/" +
              today.getFullYear() + "/" +
              ("00" + (today.getMonth()+1)).slice(-2) + "/" +
              ("00" + today.getDate()).slice(-2) + ".json"
  if (!existsSync(fileName)) {
    console.log(fileName)
    writeFileSync(fileName, JSON.stringify(data))
    saved = true
  }
  today.setDate(today.getDate() + 1)
}


console.log(JSON.stringify(data))
