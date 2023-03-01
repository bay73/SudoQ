import { Cell} from './cell'

export class Area {
  name: string
  cells: Cell[]
  
  constructor (name: string) {
    this.name = name
    this.cells = []
  }
  
  add(cell: Cell): Area {
    if (!this.cells.includes(cell)) {
      this.cells.push(cell)
    }
    return this
  }
  
  exclude(value: number): Area {
    this.cells.forEach(cell => cell.exclude(value))
    return this
  }
  
  findCellsFor(value: number): Cell[] {
    const result: Cell[] = []
    let alreadySet: boolean = false
    this.cells.forEach( cell => {
      if (cell.value === value) {
        alreadySet = true;
      }
      if (cell.value == null && cell.allowedValues.includes(value)) {
        result.push(cell)
      }
    })
    if (alreadySet) {
      return []
    } else {
      return result
    }
  }
}