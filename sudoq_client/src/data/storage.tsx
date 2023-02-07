import {SudokuData} from '../model/sudoku'
import data from "./data.json";

export type JSONData = typeof data;

export class Storage {

  static data_: JSONData

  static async init(data: JSONData) {
    Storage.data_ = data
  }

  static data(): JSONData  {
    return Storage.data_
  }

  static hasData(size: number): boolean {
    return typeof Storage.data().data.filter(item => item.size === size)[0] !== 'undefined'
  }

  static getSudoku(size: number): SudokuData | undefined {
    if (Storage.data() === undefined) {
      return undefined
    } else {
      return SudokuData.parseJSON(JSON.stringify(Storage.data().data.filter(item => item.size === size)[0]))
    }
  }
  
  static next(size: number): SudokuData | undefined {
    return Storage.getSudoku(size+1)
  }

  static hasNext(size: number): boolean {
    return Storage.hasData(size+1)
  }
}