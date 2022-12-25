export class AppState {
  state: string;
  sudokuSize: number;
  changeTime: number;
  
  constructor (state: string, sudokuSize: number) {
    this.state = state;
    this.sudokuSize = sudokuSize;
    this.changeTime = Date.now();
  }
}