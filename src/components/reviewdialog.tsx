import React from 'react'
import {Stack, Paper, Typography, Button, Box} from '@mui/material'
import {Grid} from './grid'
import {AppState} from '../model/state'
import {SudokuData} from '../model/sudoku'
import {SolvingStat} from '../model/solving_stat'
import {debounce} from './utils'
import {Storage} from '../data/storage'

interface Props {
  appState: AppState,
  setState: React.Dispatch<React.SetStateAction<AppState>>,
  sudokuData: SudokuData;
  setSudokuData: React.Dispatch<React.SetStateAction<SudokuData | undefined>>;
  solvingStat: SolvingStat
}

export function ReviewDialog(props: Props) {

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
  const wGap = 0.1
  const usedHeight = dimensions.height/ (1+hGap)
  const usedWidth = dimensions.width/ (1+wGap)
  const buttonWidth = Math.round((usedWidth-50) / 6)
  let gridSize: number = usedHeight > usedWidth ? usedWidth : usedHeight

  const buttons = Object.keys(props.solvingStat.results).map(key=>
     <Button key={key} variant='contained' onClick = {()=>setSize(parseInt(key))} style={{maxWidth: buttonWidth+'px', minWidth: '30px'}} >{key}x{key}</Button>)
  const onBackClick = function() {
    props.setState(props.appState.newState("finish"));
  }
  const result = props.solvingStat.results[props.appState.sudokuSize]

  const setSize = function(size: number) {
    props.setState(props.appState.setSize(size));
    props.setSudokuData(Storage.getSudoku(size))
  }

  return (
    <Paper elevation={12} sx={{p:1, textAlign: "center", my: 2}}>
      <Stack spacing={2} direction="column" justifyContent="space-evenly" alignItems="center">
        <Typography variant="h4" align="center" sx={{my: 3}} >Todays puzzles</Typography>
        <Stack spacing={1} direction="row" justifyContent="space-evenly" alignItems="center">
          {buttons}
        </Stack>
        <Grid gridSize={gridSize} sudokuData={props.sudokuData} appState={props.appState} />
        <Typography>You answered <Box component='span' sx={{fontWeight: 'bold'}} color={result.solved?'success.main':'error.main'}>{result.answer}</Box> in <Box component='span' sx={{fontWeight: 'bold'}}>{Math.round(result.time/100)/10}</Box> seconds</Typography>
        <Button variant='outlined' onClick = {()=>onBackClick()}>Back</Button>
      </Stack>
    </Paper>
  )
}
