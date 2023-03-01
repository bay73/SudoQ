import { Position } from './position'
import { Area } from './area'

export class Cell {
  position: Position
  areas: Area[]
  allowedValues: number[]
  value: number | null
  
  constructor (position: Position, size: number) {
    this.position = position
    this.areas = []
    this.allowedValues = Array.from(Array(size), (_, i) => i+1)
    this.value = null
  }
  
  addArea(area: Area): Cell {
    if (!this.areas.includes(area)) {
      this.areas.push(area)
    }
    return this
  }
  
  setValue(value: number): Cell {
    if (!this.allowedValues.includes(value)) {
      throw new Error(`Value ${value} is not allowed for cell ${this.position.coordinate()}`);
    }
    this.value = value
    this.areas.forEach( area => area.exclude(value))
    return this
  }
  
  exclude(value: number): Cell {
    const index = this.allowedValues.indexOf(value, 0);
    if (index > -1) {
       this.allowedValues.splice(index, 1);
    }
    return this
  }
}

