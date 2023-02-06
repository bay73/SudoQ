import {SudokuData} from '../model/sudoku'
import data from './data.json'

export class Storage {

  static hasData(size: number): boolean {
    return typeof data.data.filter(item => item.size === size)[0] !== 'undefined'
  }

  static getSudoku(size: number): SudokuData {
    return SudokuData.parseJSON(JSON.stringify(data.data.filter(item => item.size === size)[0]))
  }
  
  static next(size: number): SudokuData {
    return Storage.getSudoku(size+1)
  }

  static hasNext(size: number): boolean {
    return Storage.hasData(size+1)
  }
}