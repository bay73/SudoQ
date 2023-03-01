import { Cell } from './cell'
import { Area } from './area'
import { Grid } from './grid'

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
