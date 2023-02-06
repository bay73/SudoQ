export class AppState {
  state: string;
  sudokuSize: number;
  changeTime: number;
  
  constructor (state: string, sudokuSize: number) {
    this.state = state;
    this.sudokuSize = sudokuSize;
    this.changeTime = Date.now();
  }

  newState(state: string): AppState {
    return new AppState(state, this.sudokuSize);
  }

  static fromJson(stateJson: string | null) {
    if (stateJson !== null) {
      try {
        const state = JSON.parse(stateJson)
        const today = new Date();
        today.setHours(0,0,0,0)
        if (state.changeTime >= today.getTime()) {
          const appState = new AppState(state.state, state.sudokuSize)
          appState.changeTime = state.changeTime
          return appState
        }
      } catch(e){
      }
    }
    return new AppState("starting", 4)
  }
}
