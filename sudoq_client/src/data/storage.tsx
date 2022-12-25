import {SudokuData} from '../model/sudoku'

  const gridData: any[] = []

  gridData[4] = {size: 4, a3: 1, b2: 2, c1:3, d2:4, areas: [["a1","a2","b1","b2"],["c1","c2","d1","d2"],["a3","a4","b3","b4"],["c3","c4","d3","d4"]], goal: "d4", goalValue: 1, medianTime: 20}

  gridData[5] = {size :5, b1: 1, b2: 2, d4:4, d5:5, areas: [["a1","a2","a3","a4","b2"],["b1","c1","d1","d2","e1"],["a5","b4","b5","c5","d5"],["d4","e2","e3","e4","e5"],["b3","c2","c3","c4","d3"]], goal: "c3", goalValue: 3, medianTime: 30}

  gridData[6] = {size :6, a1: 4, a4: 3, b5: 2, c6:1, d1:6, d4: 5, e2: 5, f3: 4, f6: 3, areas: [["a1","a2","b1","b2","c1","c2"],["d1","d2","e1","e2","f1","f2"],["a3","a4","b3","b4","c3","c4"],["d3","d4","e3","e4","f3","f4"],["a5","a6","b5","b6","c5","c6"],["d5","d6","e5","e6","f5","f6"]], goal: "c3", goalValue: 5, medianTime: 100}

export class Storage {

  static hasData(size: number): boolean {
    return typeof gridData[size] !== 'undefined'
  }

  static getSudoku(size: number): SudokuData {
    return SudokuData.parseJSON(JSON.stringify(gridData[size]))
  }
  
  static next(size: number): SudokuData {
    return Storage.getSudoku(size+1)
  }

  static hasNext(size: number): boolean {
    return Storage.hasData(size+1)
  }
}