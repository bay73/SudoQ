import { Position } from './position'
import { Cell } from './cell'
import { Grid, allGrids } from './grids'
import { solve } from './strategies'
import { randomElement, BuildPattern } from './patterns'
import { putRandom } from './strategies'

interface Step {
  position: String[]
  value: number
  strategy: "nakedSingle" | "hiddenSingle"
}

interface Path {
  complexity: number
  steps: Step[]
}

function tryAll(grid: Grid, baseComplexity: number, paths: Path[][], steps: Step[]) {
  if (baseComplexity > 7) return
  for (let row = 0; row < grid.size; row++) {
    for (let column = 0; column < grid.size; column++) {
      const position = new Position(row, column)
      const cell: Cell = grid.cell(position)
      if (cell.value === null && cell.allowedValues.length === 1) {
        const value = cell.allowedValues[0]
        const newGrid = grid.copy()
        newGrid.setValue(position, value)
        const step: Step = {position: [position.coordinate()], value: value, strategy: "nakedSingle"}
        const newSteps = Object.assign([], steps);
        newSteps.push(step)
        if(paths[row][column].complexity > baseComplexity*3) {
          paths[row][column].complexity = baseComplexity*3
          paths[position.row][position.column].steps = newSteps
        }
        tryAll(newGrid, baseComplexity*3, paths, newSteps)
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
        const step: Step = {position: [position.coordinate()], value: v, strategy: "hiddenSingle"}
        const newSteps = Object.assign([], steps);
        newSteps.push(step)
        if(paths[position.row][position.column].complexity > baseComplexity*2) {
          paths[position.row][position.column].complexity = baseComplexity*2
          paths[position.row][position.column].steps = newSteps
        }
        tryAll(newGrid, baseComplexity*2, paths, newSteps)
      }
    }
  }
}


function allPathes(grid: Grid) {
  const paths: Path[][] = []
  for (let row = 0; row < grid.size; row++) {
    paths[row] = []
    for (let column = 0; column < grid.size; column++) {
      paths[row][column] = {complexity: 1000, steps: []}
    }
  }

  tryAll(grid, 1, paths, [])
  
  return paths
}

export function chooseGoalAndStringify(grid: Grid, minimumComplexity: number, maximumComplexity: number): Record<string, any> | undefined {
  const paths = allPathes(grid)
  const solution = grid.copy()
  solve(solution)

  grid.print()
  console.log("------------")
  
  const goals: Position[] = []
  
  for (let row = grid.size - 1; row >= 0; row--) {
    for (let column = 0; column < grid.size; column++) {
      const c = paths[row][column].complexity
      if (c >= minimumComplexity && c <= maximumComplexity) {
        goals.push(new Position(row, column))
      }
    }
  }
  if (goals.length > 0) {
    const timeMultiplier: number[] = []
    timeMultiplier[4] = 3.1
    timeMultiplier[5] = 6.4
    timeMultiplier[6] = 6.5
    timeMultiplier[7] = 11.9
    timeMultiplier[8] = 13.1
    timeMultiplier[9] = 13.7
    const index = Math.floor(Math.random() * goals.length)
    const goal = goals[index]
    const goalValue = solution.cell(goal).value
    let pathComplexity = paths[goal.row][goal.column].complexity;
    if (pathComplexity==3) {
      pathComplexity = 0.7;
    }
    const complexity = Math.floor(pathComplexity * timeMultiplier[grid.size])
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
    result["steps"] = paths[goal.row][goal.column].steps
    
    return result
  } else {
    return undefined
  }
}

export function randomPuzzle(size: number, minimumComplexity: number, maximumComplexity: number) {
  const grid = randomElement(allGrids[size])
  let pattern = BuildPattern(size)

  let counter = 0;
  while (true) {
    if (counter > 3) {
      console.log('Try another pattern')
      pattern = BuildPattern(size)
      counter = 0
    }
    const randomGrid = putRandom(grid.copy(), pattern, 1, Date.now());
    if (randomGrid !== undefined) {
      const result = chooseGoalAndStringify(randomGrid, minimumComplexity, maximumComplexity)
      if (result !== undefined) {
        return result
      }
    } else {
      console.log('Could not fill random')
    }
    counter++;
  }
}
