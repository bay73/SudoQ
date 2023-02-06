import React from 'react'
import {Container} from '@mui/material'
import {MainPage} from './main'
import {StartDialog} from './startdialog'
import {FinishDialog} from './finishdialog'
import {HelpDialog} from './helpdialog'
import {Storage} from '../data/storage'
import {SolvingStat} from '../model/solving_stat'
import {AppState} from '../model/state'

function App() {

  const [appState, setState] = React.useState(AppState.fromJson(localStorage.getItem("state")))
  const [sudokuData, setSudokuData] = React.useState(Storage.getSudoku(appState.sudokuSize))
  const [solvingStat, setSolvingStat] = React.useState(SolvingStat.fromJson(localStorage.getItem("solving-stat")))

  React.useEffect(() => {
      localStorage.setItem("state", JSON.stringify(appState))
    },[appState])
  React.useEffect(() => {
      localStorage.setItem("solving-stat", JSON.stringify(solvingStat))
    },[solvingStat])

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
