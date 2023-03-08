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
}

export function HistoryDialog(props: Props) {

  const [history, setHistory] = React.useState(localStorage)

  const onBackClick = function() {
    props.setState(props.appState.newState("finish"));
  }
  
  const ratings = []
  let days = 0
  const startDate = new Date(Date.parse(history["historyStartDate"]))
  let date = startDate
  while (date < new Date()) {
    date = new Date()
    date.setDate(startDate.getDate() + days)
    let dateStr = date.toLocaleDateString();
    if (history["history" + days] != undefined) {
      ratings.push({days: days, date: dateStr, value: history["history" + days]})
    }
    days++
  }
  const ratingPicture = ratings.map(r => <Typography align="left" key = {r.days}>{r.date} - {r.value}</Typography>)

  return (
    <Paper elevation={12} sx={{p:1, textAlign: "center", my: 2}}>
      <Stack spacing={2} direction="column" justifyContent="space-evenly" alignItems="center">
        <Typography variant="h4" align="center" sx={{my: 3}} >SudoQ rating history</Typography>
        {ratingPicture}
        <Button variant='outlined' onClick = {()=>onBackClick()}>Back</Button>
      </Stack>
    </Paper>
  )

}
