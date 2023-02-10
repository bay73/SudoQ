import React from 'react'
import {Stack, Paper} from '@mui/material'
import {Grid} from './grid'
import {Buttons} from './buttons'
import {Header} from './header'
import {debounce} from './utils'
import {SudokuData} from '../model/sudoku'
import {SolvingStat} from '../model/solving_stat'
import {AppState} from '../model/state'


interface Props {
  appState: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  sudokuData: SudokuData;
  setSudokuData: React.Dispatch<React.SetStateAction<SudokuData | undefined>>;
  solvingStat: SolvingStat;
  setSolvingStat: React.Dispatch<React.SetStateAction<SolvingStat>>;
}

export function MainPage(props: Props) {

  const [dimensions, setDimensions] = React.useState({ 
    height: window.innerHeight,
    width: window.innerWidth
  })
  React.useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      })
    }, 200)

    window.addEventListener('resize', debouncedHandleResize)

    return () => {
      window.removeEventListener('resize', debouncedHandleResize)
    }
  })
  
  const hGap = 0.05
  const vGap = 0.1
  const headerFraction = 0.3
  const usedHeight = dimensions.height/ (1+hGap)
  const usedWidth = dimensions.width/ (1+vGap)
  
  let vertical: boolean
  let gridSize: number
  let headerHeight: number
  let headerWidth: number
  let buttonsHeight: number
  let buttonsWidth: number
  if (usedWidth > usedHeight) {
    vertical = false
    gridSize = usedHeight / (1+headerFraction)
    headerHeight = usedHeight - gridSize
    headerWidth = usedWidth
    buttonsHeight = gridSize
    buttonsWidth = gridSize / props.sudokuData.size
  } else {
    vertical = true
    const buttonFraction = 1/props.sudokuData.size
    gridSize = usedHeight / (1 + headerFraction + buttonFraction)
    gridSize = gridSize > usedWidth ? usedWidth : gridSize
    buttonsHeight = gridSize / props.sudokuData.size
    buttonsWidth = gridSize
    headerHeight = usedHeight - gridSize - buttonsHeight
    headerWidth = usedWidth
  }
    
  return (
    <Stack spacing={2} direction="column" justifyContent="space-evenly" alignItems="center">
      <Header sudokuSize={props.sudokuData.size} areaWidth={headerWidth} areaHeight={headerHeight} />
      <Stack spacing={2} direction={vertical?"column":"row"} justifyContent="space-evenly" alignItems="center">
        <Paper elevation={12} sx={{p:0}}>
          < Grid gridSize={gridSize} sudokuData={props.sudokuData} appState={props.appState} />
        </Paper>
        <Buttons areaWidth={buttonsWidth} areaHeight={buttonsHeight} sudokuData={props.sudokuData} appState={props.appState} setState={props.setState} setSudokuData={props.setSudokuData} solvingStat={props.solvingStat} setSolvingStat={props.setSolvingStat} />
      </Stack>
    </Stack>
  );
}