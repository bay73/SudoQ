export class Position {
  row: number
  column: number
  constructor (row: number, column: number) {
    this.row = row
    this.column = column
  }
  
  coordinate(): string {
    return String.fromCharCode('a'.charCodeAt(0) + this.column) + (this.row+1).toString();
  }
  
  static parse(coordinate: string): Position {
    return new Position(parseInt(coordinate.substring(1)) - 1, coordinate.charCodeAt(0) - 'a'.charCodeAt(0))
  }
}
