import {SudokuData} from '../model/sudoku'

  const gridData: any[] = []

  gridData[4] = {size: 4, a3: 1, b2: 2, c1:3, d2:4, areas: [["a1","a2","b1","b2"],["c1","c2","d1","d2"],["a3","a4","b3","b4"],["c3","c4","d3","d4"]], goal: "d4", goalValue: 1, medianTime: 20}

  gridData[5] = {size :5, b1: 1, b2: 2, d4:4, d5:5, areas: [["a1","a2","a3","a4","b2"],["b1","c1","d1","d2","e1"],["a5","b4","b5","c5","d5"],["d4","e2","e3","e4","e5"],["b3","c2","c3","c4","d3"]], goal: "c3", goalValue: 3, medianTime: 30}

  gridData[6] = {size :6, a1: 4, a4: 3, b5: 2, c6:1, d1:6, d4: 5, e2: 5, f3: 4, f6: 3, areas: [["a1","a2","b1","b2","c1","c2"],["d1","d2","e1","e2","f1","f2"],["a3","a4","b3","b4","c3","c4"],["d3","d4","e3","e4","f3","f4"],["a5","a6","b5","b6","c5","c6"],["d5","d6","e5","e6","f5","f6"]], goal: "c3", goalValue: 5, medianTime: 100}
  
  gridData[7] = {size :7, c1: 7, d1: 6, e1: 5, d2: 4, a3: 3, g3: 5, a4: 4, b4: 7, f4: 2, g4: 3, a5: 5, g5: 4, d6: 7, c7: 4, d7: 2, e7: 1, areas: [["a1", "b1", "c1", "a2", "b2", "c2", "d2"],["d1", "e1", "f1", "g1", "e2", "f2", "g2"],["a3", "b3", "c3", "a4", "b4", "c4", "d4"],["d3", "e3", "f3", "g3", "e4", "f4", "g4"],["a5", "b5", "c5", "a6", "b6", "c6", "d6"],["d5", "e5", "f5", "g5", "e6", "f6", "g6"],["a7", "b7", "c7", "d7", "e7", "f7", "g7"]], goal: "d3", goalValue: 1, medianTime: 100}
  
  gridData[8] = {size :8, b1: 3 ,c1: 4 ,f1: 6 ,g1: 5 ,a2: 1 ,h2: 3 ,a3: 3 ,c3: 8 ,f3: 2 ,h3: 6 ,d4: 7 ,e4: 1 ,d5: 5 ,e5: 7 ,a6: 2 ,c6: 7 ,f6: 5 ,h6: 4 ,a7: 8 ,h7: 7 ,b8: 7 ,c8: 3 ,f8: 4 ,g8: 2, areas: [["a1", "b1", "c1", "d1", "a2", "b2", "c2", "d2"],["e1", "f1", "g1", "h1", "e2", "f2", "g2", "h2"],["a3", "b3", "c3", "d3", "a4", "b4", "c4", "d4"],["e3", "f3", "g3", "h3", "e4", "f4", "g4", "h4"],["a5", "b5", "c5", "d5", "a6", "b6", "c6", "d6"],["e5", "f5", "g5", "h5", "e6", "f6", "g6", "h6"],["a7", "b7", "c7", "d7", "a8", "b8", "c8", "d8"],["e7", "f7", "g7", "h7", "e8", "f8", "g8", "h8"]], goal: "f2", goalValue: 7, medianTime: 150}
  
  
  gridData[9] = {size :9, c1: 4, d1: 9, e1: 6, f1: 3, g1: 1, b2: 2, h2: 6, a3: 6, d3: 4, e3: 5, f3: 2, i3: 8, a4: 8, c4: 2, g4: 3, i4: 1, a5: 1, c5: 7, g5: 6, i5: 4, a6: 3, c6: 6, g6: 5, i6: 7, a7: 9, d7: 6, e7: 1, f7: 5, i7: 3, b8: 6, h8: 7, c9: 5, d9: 8, e9: 2, f9: 7, g9: 9, areas: [["a1", "b1", "c1", "a2", "b2", "c2", "a3", "b3", "c3"],["d1", "e1", "f1", "d2", "e2", "f2", "d3", "e3", "f3"],["g1", "h1", "i1", "g2", "h2", "i2", "g3", "h3", "i3"],["a4", "b4", "c4", "a5", "b5", "c5", "a6", "b6", "c6"],["d4", "e4", "f4", "d5", "e5", "f5", "d6", "e6", "f6"],["g4", "h4", "i4", "g5", "h5", "i5", "g6", "h6", "i6"],["a7", "b7", "c7", "a8", "b8", "c8", "a9", "b9", "c9"],["d7", "e7", "f7", "d8", "e8", "f8", "d9", "e9", "f9"],["g7", "h7", "i7", "g8", "h8", "i8", "g9", "h9", "i9"]], goal: "e5", goalValue: 3, medianTime: 200}

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