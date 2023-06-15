import { Cell } from './cell'
import { Area } from './area'
import { Grid } from './grids'
import { Position } from './position'
import { Pattern } from './patterns'

const MAX_RANDOM_TIME = 30000;

function nakedSingle(grid: Grid): Cell | undefined {
  return grid.tryCells(function(cell: Cell): Cell | undefined {
    if (cell.value === null && cell.allowedValues.length === 1) {
      const value = cell.allowedValues[0]
      cell.setValue(value)
      return cell
    }
    return undefined
  })
}

function hiddenSingle(grid: Grid): Cell | undefined {
  const size = grid.size  
  return grid.tryAreas(function(area: Area): Cell | undefined {
    for (let v = 1; v<=size; v++) {
      const cells = area.findCellsFor(v)
      if (cells.length === 1) {
        const cell = cells[0]
        cell.setValue(v)
        return cell
      }
    }
    return undefined
  })
}

export const Strategies: {(grid: Grid): Cell | undefined}[] = [nakedSingle, hiddenSingle]

function applyAnyStrategy(grid: Grid): Cell | undefined {
  for (let i=0; i < Strategies.length; i++) {
    const cell = Strategies[i](grid)
    if (cell != undefined) {
      return cell
    }
  }
  return undefined
}

export function solve(grid: Grid) {
  let result = true
  while(result) {
    result = (applyAnyStrategy(grid) !== undefined)
  }
}

export function putRandom(grid: Grid, pattern: Pattern, stage: number, startTime: number): Grid | undefined {
  if (stage > pattern.maxStage) {
    return undefined
  }
  if (Date.now() - startTime > MAX_RANDOM_TIME) {
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
          const result = putRandom(newGrid, pattern, stage, startTime)
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
  return putRandom(grid, pattern, stage + 1, startTime)
}




