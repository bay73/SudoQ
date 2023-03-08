export class Cell {
  row: number;
  column: number;
  
  constructor(row: number, column: number) {
    this.row = row;
    this.column = column;
  }

  static byCoordinate(size: number, coordinate: string) {
    return new Cell(size - (coordinate.charCodeAt(1)-"1".charCodeAt(0)) - 1, coordinate.charCodeAt(0)-"a".charCodeAt(0));
  }

}

export class Value {
  value: number;

  constructor(value: number) {
    this.value = value;
  }
}

export class CellValue {
  cell: Cell;
  value: Value;

  constructor(cell: Cell, value: Value) {
    this.cell = cell;
    this.value = value;
  }
}

export class Step {
  cells: Cell[];
  value: Value;
  strategy: string

  constructor(cells: Cell[], value: Value, strategy: string) {
    this.cells = cells;
    this.value = value;
    this.strategy = strategy
  }
}

export class SudokuData {
  size: number;
  areas: Cell[][];
  clues: CellValue[];
  goal: CellValue;
  steps: Step[]
  medianTime: number;
  
  constructor(size: number, areas: Cell[][], clues: CellValue[], goal: CellValue, medianTime: number, steps: Step[]) {
    this.size = size;
    this.areas = areas;
    this.clues = clues;
    this.goal = goal;
    this.medianTime = medianTime;
    this.steps = steps
  }


  static parseJSON(json: string): SudokuData {
    const nonClueKeys = ["size", "areas", "goal", "goalValue", "medianTime", "steps"];
  
    const gridData = JSON.parse(json)
    
    const size = gridData.size as number
    const clues: CellValue[] = Object.entries(gridData)
      .filter(([key, value]) => !nonClueKeys.includes(key))
      .map(([key, value]) => new CellValue(Cell.byCoordinate(size, key), new Value(value as number)))
    const areas: Cell[][] = gridData.areas
      .map((area: string[]) => area.map(coordinate => Cell.byCoordinate(size, coordinate)))
    const goal: CellValue = new CellValue(Cell.byCoordinate(size, gridData.goal), new Value(gridData.goalValue as number))
    const medianTime = gridData.medianTime
    const steps = gridData.steps.map((step: any) => new Step(step.position.map((position: any) => Cell.byCoordinate(size, position)), new Value (step.value), step.strategy))

    return new SudokuData(size, areas, clues, goal, medianTime, steps)
  }
}

