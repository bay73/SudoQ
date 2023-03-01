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
