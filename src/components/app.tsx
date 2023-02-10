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

  const [appState, setState] = React.useState(new AppState("init", 4))
  const [sudokuData, setSudokuData] = React.useState(Storage.getSudoku(appState.sudokuSize))
  const [solvingStat, setSolvingStat] = React.useState(SolvingStat.fromJson(localStorage.getItem("solving-stat")))

  React.useEffect(() => {
      (async () => {
        const today = new Date();
        const address = "https://bay73.github.io/SudoQ/data/" +
              today.getFullYear() + "/" +
              ("00" + (today.getMonth()+1)).slice(-2) + "/" +
              ("00" + today.getDate()).slice(-2) + ".json"
        const response = await fetch(address);
        const data = await response.json();
        Storage.init(data)
        const state = AppState.fromJson(localStorage.getItem("state"))
        if (state.state === "init") {
          setState(state.newState("starting"))
        } else {
          setState(state)
        }
        setSudokuData(Storage.getSudoku(appState.sudokuSize))
      })();
    },[])
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
  } else if (sudokuData !== undefined) {
    return (
      <Container>
        <MainPage sudokuData={sudokuData} appState={appState} setState={setState} setSudokuData={setSudokuData} solvingStat={solvingStat} setSolvingStat={setSolvingStat} />
        <StartDialog appState={appState} setState={setState} sudokuData={sudokuData}/>
      </Container>
    )
  } else {
    return (
      <Container>
      </Container>
    )
  }
}

export default App;
