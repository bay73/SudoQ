import React from 'react'
import {Container} from '@mui/material'
import {MainPage} from './main'
import {StartDialog} from './startdialog'
import {FinishDialog} from './finishdialog'
import {HelpDialog} from './helpdialog'
import {Storage} from '../data/storage'
import {SolvingStat} from '../model/solving_stat'
import {AppState} from '../model/state'

function getStateFromLocalStorage(): AppState {
  const stateJson = localStorage.getItem("state")
  console.log(stateJson)
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

function App() {


  const [appState, setState] = React.useState(getStateFromLocalStorage())
  const [sudokuData, setSudokuData] = React.useState(Storage.getSudoku(appState.sudokuSize))
  const [solvingStat, setSolvingStat] = React.useState(new SolvingStat())

  React.useEffect(() => {
      localStorage.setItem("state", JSON.stringify(appState))
    },[appState])

  if (appState.state === 'finish') {

    return (
      <Container>
        <FinishDialog appState={appState} solvingStat={solvingStat} />
      </Container>
    )
  } else if (appState.state === 'help') {
    return (
      <Container>
        <HelpDialog appState={appState} setState={setState}  />
      </Container>
    )
  } else {
    return (
      <Container>
        <MainPage sudokuData={sudokuData} appState={appState} setState={setState} setSudokuData={setSudokuData} solvingStat={solvingStat} setSolvingStat={setSolvingStat} />
        <StartDialog appState={appState} setState={setState} sudokuData={sudokuData}/>
      </Container>
    )
  }
}

export default App;
