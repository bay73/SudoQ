import { Position } from './position'
import { Cell } from './cell'
import { Area } from './area'

export class Grid {
  size: number
  areasSource: string[][]
  cells: Cell[][]
  areas: Area[]
  
  constructor (size: number, areas: string[][]) {
    this.size = size
    this.areasSource = areas
    this.cells = []
    this.areas = []
    for (let row = 0; row < size; row++) {
      this.cells[row] = []
      for (let column = 0; column < size; column++) {
        this.cells[row][column] = new Cell(new Position(row, column), size)
      }
    }
    // create rows
    for (let row = 0; row < size; row++) {
      const rowArea: Area = new Area("row " + row)
      for (let column = 0; column < size; column++) {
        const cell: Cell = this.cell(new Position(row, column))
        rowArea.add(cell)
        cell.addArea(rowArea)
      }
      this.areas.push(rowArea)
    }
    // create columns
    for (let column = 0; column < size; column++) {
      const columnArea: Area = new Area("column " + column)
      for (let row = 0; row < size; row++) {
        const cell: Cell = this.cell(new Position(row, column))
        columnArea.add(cell)
        cell.addArea(columnArea)
      }
      this.areas.push(columnArea)
    }
    // create areas
    for (let area = 0; area < areas.length; area++) {
      const areaArea: Area = new Area("area " + area)
      for (let i = 0; i < areas[area].length; i++) {
        const cell: Cell = this.cell(Position.parse(areas[area][i]))
        areaArea.add(cell)
        cell.addArea(areaArea)
      }
      this.areas.push(areaArea)
    }
  }
  
  cell(position: Position): Cell {
    return this.cells[position.row][position.column]
  }
  
  setValue(position: Position, value: number | null): Grid {
    if (value != null) {
      const cell = this.cell(position)
      cell.setValue(value)
    }
    return this
  }
  
  tryCells<T>(fn: (cell: Cell) => T | undefined): T | undefined {
    for (let row = 0; row < this.size; row++) {
      for (let column = 0; column < this.size; column++) {
        const cell: Cell = this.cell(new Position(row, column))
        const result = fn(cell)
        if (result !== undefined) {
          return result;
        }
      }
    }
    return undefined;
  }
  
  tryAreas<T>(fn: (area: Area) => T | undefined): T | undefined {
    for (let a = 0; a < this.areas.length; a++) {
      const result = fn(this.areas[a])
      if (result !== undefined ) {
        return result;
      }
    }
    return undefined;
  }

  print() {
    for (let row = this.size - 1; row >= 0; row--) {
      let str = "";
      for (let column = 0; column < this.size; column++) {
        const cell: Cell = this.cell(new Position(row, column))
        str += (cell.value ? cell.value : ".")+ " "
      }
      console.log(str)
    }
  }
  
  printAreas() {
    const map: number[][] = []
    for (let row = 0; row < this.size; row++) {
      map[row] = []
      for (let column = 0; column < this.size; column++) {
        map[row][column] = 0
      }
    }
    for (let area = 0; area < this.areasSource.length; area++) {
      for (let i = 0; i < this.areasSource[area].length; i++) {
        const position = Position.parse(this.areasSource[area][i])
        map[position.row][position.column] = area+1
      }
    }
    for (let row = this.size - 1; row >= 0; row--) {
      let str = "";
      for (let column = 0; column < this.size; column++) {
        str += map[row][column]+ " "
      }
      console.log(str)
    }
  }

  copy(): Grid {
    const newGrid = new Grid(this.size, this.areasSource)
    for (let row = 0; row < this.size; row++) {
      for (let column = 0; column < this.size; column++) {
        const oldCell = this.cell(new Position(row, column))
        const newCell = newGrid.cell(new Position(row, column))
        newCell.allowedValues = [...oldCell.allowedValues]
        newCell.value = oldCell.value
      }
    }
    return newGrid
  }
  
  findEmptyCell(): Cell | undefined {
    for (let row = 0; row < this.size; row++) {
      for (let column = 0; column < this.size; column++) {
        if (this.cell(new Position(row, column)).value === null) {
          return this.cell(new Position(row, column))
        }
      }
    }
    return undefined
  }
  
  setClues(clues: string) {
    const obj = JSON.parse(clues)
    for (const [k, v] of Object.entries(obj)) {
      this.setValue(Position.parse(k), v as number)
    }
    return this
  }
}

export function setClues(grid: Grid, clues: string) {
  const obj = JSON.parse(clues)
  for (const [k, v] of Object.entries(obj)) {
    grid.setValue(Position.parse(k), v as number)
  }
}

export const allGrids: Grid[][] = []

allGrids[4] = []
allGrids[5] = []
allGrids[6] = []
allGrids[7] = []
allGrids[8] = []
allGrids[9] = []

allGrids[4].push(new Grid(4, [["a4", "b4", "a3", "b3"],["c4", "d4", "c3", "d3"],["a2", "b2", "a1", "b1"],["c2", "d2", "c1", "d1"]]))

allGrids[5].push(new Grid(5, [["a1", "a2", "a3", "a4", "b2"],["b1", "c1", "d1", "d2", "e1"],["a5", "b4", "b5", "c5", "d5"],["d4", "e2", "e3", "e4", "e5"],["b3", "c2", "c3", "c4", "d3"]]))
allGrids[5].push(new Grid(5, [["a5", "b5", "a4", "b4", "a3"],["c5", "d5", "e5", "d4", "e4"],["c4", "c3", "b3", "d3", "c2"],["e3", "e2", "d2", "d1", "e1"],["a2", "b2", "a1", "b1", "c1"]]))
allGrids[5].push(new Grid(5, [["a1", "a2", "b1", "b2", "c1"],["c2", "d1", "d2", "e1", "e2"],["a3", "b3", "c3", "d3", "e3"],["a4", "a5", "b4", "b5", "c4"],["c5", "d4", "d5", "e4", "e5"]]))
allGrids[5].push(new Grid(5, [["a1", "a2", "b1", "b2", "c1"],["d1", "d3", "e3", "e1", "e2"],["a3", "b3", "a4", "a5", "b5"],["b4", "c4", "c3", "c2", "d2"],["c5", "d4", "d5", "e4", "e5"]]))
allGrids[5].push(new Grid(5, [["a1", "a2", "a3", "a4", "b4"],["b1", "c1", "d1", "b2", "e1"],["a5", "d4", "b5", "c5", "d5"],["d2", "e2", "e3", "e4", "e5"],["b3", "c2", "c3", "c4", "d3"]]))
allGrids[5].push(new Grid(5, [["a1", "a2", "a3", "b1", "c1"],["a4", "a5", "b4", "b5", "c4"],["b2", "b3", "c3", "d3", "d4"],["c2", "d1", "d2", "e1", "e2"],["c5", "d5", "e5", "e4", "e3"]]))

allGrids[6].push(new Grid(6, [["a1", "b1", "c1", "a2", "b2", "c2"],["a3", "b3", "c3", "a4", "b4", "c4"],["a5", "b5", "c5", "a6", "b6", "c6"],["d1", "e1", "f1", "d2", "e2", "f2"],["d3", "e3", "f3", "d4", "e4", "f4"],["d5", "e5", "f5", "d6", "e6", "f6"]]))

allGrids[7].push(new Grid(7, [["a1", "b1", "c1", "a2", "b2", "c2", "d2"],["d1", "e1", "f1", "g1", "e2", "f2", "g2"],["a3", "b3", "c3", "a4", "b4", "c4", "d4"],["d3", "e3", "f3", "g3", "e4", "f4", "g4"],["a5", "b5", "c5", "a6", "b6", "c6", "d6"],["d5", "e5", "f5", "g5", "e6", "f6", "g6"],["a7", "b7", "c7", "d7", "e7", "f7", "g7"]]))
allGrids[7].push(new Grid(7, [["a7", "b7", "c7", "a5", "a6", "b6", "c6"],["f7", "g7", "g6", "g5", "f4", "g4", "f3"],["d6", "d7", "e5", "e6", "e7", "f5", "f6"],["a1", "a2", "a3", "a4", "b1", "b4", "b5"],["b2", "b3", "c1", "c2", "c3", "d1", "d2"],["c4", "c5", "d3", "d4", "d5", "e3", "e4"],["e1", "e2", "f1", "f2", "g1", "g2", "g3"]]))
allGrids[7].push(new Grid(7, [["a7", "b7", "c7", "d7", "a6", "b6", "c6"],["e7", "f7", "g7", "f6", "g6", "f5", "g5"],["d6", "d5", "a5", "b5", "c5", "a4", "b4"],["e6", "e5", "e4", "c4", "d4", "c3", "c2"],["f4", "g4", "f3", "d3", "e3", "g3", "d2"],["a3", "b3", "a2", "b2", "a1", "b1", "c1"],["e2", "f2", "g2", "e1", "d1", "f1", "g1"]]))
allGrids[7].push(new Grid(7, [["a1", "a2", "a3", "b1", "b2", "b3", "c1"],["a4", "a5", "a6", "a7", "b7", "c7", "d7"],["b4", "b5", "b6", "c4", "c6", "d4", "d6"],["c3", "c5", "d3", "d5", "e3", "e4", "e5"],["c2", "d2", "e2", "f2", "f3", "f4", "f5"],["d1", "e1", "f1", "g1", "g2", "g3", "g4"],["e6", "e7", "f6", "f7", "g5", "g6", "g7"]]))
allGrids[7].push(new Grid(7, [["a1", "a2", "b1", "c1", "d1", "d2", "d3"],["a3", "a4", "a5", "a6", "a7", "b7", "c7"],["c2", "b2", "b3", "b4", "b5", "b6", "c6"],["c3", "c4", "c5", "d4", "e3", "e4", "e5"],["d5", "d6", "d7", "e7", "f7", "g7", "g6"],["e2", "f2", "f3", "f4", "f5", "f6", "e6"],["e1", "f1", "g1", "g2", "g3", "g4", "g5"]]))
allGrids[7].push(new Grid(7, [["a1", "b1", "b2", "c1", "c2", "c3", "d2"],["d1", "e1", "e2", "e3", "f1", "f2", "g1"],["a2", "a3", "a4", "a5", "a6", "b3", "b5"],["b4", "c4", "d3", "d4", "d5", "e4", "f4"],["f3", "f5", "g2", "g3", "g4", "g5", "g6"],["a7", "b6", "b7", "c5", "c6", "c7", "d7"],["d6", "e5", "e6", "e7", "f6", "f7", "g7"]]))
allGrids[7].push(new Grid(7, [["a1", "a2", "a3", "a4", "a5", "b1", "b2"],["a6", "a7", "b3", "b4", "b5", "b6", "b7"],["c3", "c2", "c1", "d1", "e1", "e2", "e3"],["c4", "d2", "d3", "d4", "d5", "d6", "e4"],["c5", "c6", "c7", "d7", "e7", "e6", "e5"],["f1", "f2", "f3", "f4", "f5", "g1", "g2"],["f6", "f7", "g3", "g4", "g5", "g6", "g7"]]))
allGrids[7].push(new Grid(7, [["a1", "a2", "a3", "a4", "b1", "c1", "d1"],["a5", "a6", "a7", "b6", "b7", "c6", "c7"],["b2", "b3", "b4", "b5", "c5", "c2", "d2"],["c3", "c4", "d3", "d4", "d5", "e4", "e5"],["e1", "e2", "f1", "f2", "g1", "g2", "g3"],["e3", "f3", "f4", "f5", "f6", "e6", "d6"],["g4", "g5", "g6", "g7", "f7", "e7", "d7"]]))
allGrids[7].push(new Grid(7, [["a1", "a2", "a3", "b1", "b3", "c1", "c3"],["b2", "c2", "d1", "d2", "d3", "e2", "f2"],["e1", "e3", "f1", "f3", "g1", "g2", "g3"],["a4", "b4", "c4", "d4", "e4", "f4", "g4"],["a5", "a6", "a7", "b5", "b7", "c5", "c7"],["b6", "c6", "d5", "d6", "d7", "e6", "f6"],["e5", "e7", "f5", "f7", "g5", "g6", "g7"]]))

allGrids[8].push(new Grid(8, [["a1", "b1", "c1", "d1", "a2", "b2", "c2", "d2"],["e1", "f1", "g1", "h1", "e2", "f2", "g2", "h2"],["a3", "b3", "c3", "d3", "a4", "b4", "c4", "d4"],["e3", "f3", "g3", "h3", "e4", "f4", "g4", "h4"],["a5", "b5", "c5", "d5", "a6", "b6", "c6", "d6"],["e5", "f5", "g5", "h5", "e6", "f6", "g6", "h6"],["a7", "b7", "c7", "d7", "a8", "b8", "c8", "d8"],["e7", "f7", "g7", "h7", "e8", "f8", "g8", "h8"]]))

allGrids[9].push(new Grid(9, [["a9", "b9", "c9", "a8", "b8", "c8", "a7", "b7", "c7"],["d9", "e9", "f9", "d8", "e8", "f8", "d7", "e7", "f7"],["g9", "h9", "i9", "g8", "h8", "i8", "g7", "h7", "i7"],["a6", "b6", "c6", "a5", "b5", "c5", "a4", "b4", "c4"],["d6", "e6", "f6", "d5", "e5", "f5", "d4", "e4", "f4"],["g6", "h6", "i6", "g5", "h5", "i5", "g4", "h4", "i4"],["a3", "b3", "c3", "a2", "b2", "c2", "a1", "b1", "c1"],["d3", "e3", "f3", "d2", "e2", "f2", "d1", "e1", "f1"],["g3", "h3", "i3", "g2", "h2", "i2", "g1", "h1", "i1"]]))
