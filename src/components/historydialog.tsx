import React from 'react'
import {Stack, Paper, Typography, Button, Box} from '@mui/material'
import {AppState} from '../model/state'
import {History, HistoryItem} from '../model/history'

interface Props {
  appState: AppState,
  setState: React.Dispatch<React.SetStateAction<AppState>>,
}

export function HistoryDialog(props: Props) {

  const [history] = React.useState(History.fromJson(localStorage.getItem("history")))
  const onBackClick = function() {
    props.setState(props.appState.newState("finish"));
  }
  const historyData = history.items.sort((h1, h2) => h1.day - h2.day).slice(-50)
  var barSickness = Math.round(500 / historyData.length)
  if (barSickness > 25) barSickness = 25
  if (barSickness < 12) barSickness = 12
  const chart = historyData.map(h => DrawItem(h, barSickness))

  return (
    <Paper elevation={12} sx={{p:1, textAlign: "center", my: 2}}>
      <Stack spacing={1} direction="column" justifyContent="space-evenly" alignItems="center">
        <Typography variant="h4" align="center" sx={{my: 1}} >SudoQ history</Typography>
        <Box sx={{ width: '100%' }}>
          {chart}
        </Box>
        <Button variant='outlined' onClick = {()=>onBackClick()}>Back</Button>
      </Stack>
    </Paper>
  )

}

function DrawItem(item: HistoryItem, barSickness: number) {
  let date: string = item.date.getDate() + "/" + item.date.getMonth()
  return <Box key={item.day} sx={{display: 'block', height: barSickness + 'px', width: '100%', textAlign: 'left'}}>
    <Box sx={{display: 'inline-block', height: '100%', width: '10%', fontSize: (barSickness/2) + 'px'}}>{date}</Box>
    <Box sx={{display: 'inline-block', height: '100%', width: '90%'}}>
      <Box sx={{pr: 1, display: 'inline-block', height: '100%', width: (item.value/2)+'%', 'backgroundColor': 'blue', textAlign: 'right', color: 'white', fontSize: (barSickness*2/3) + 'px', fontWeight: 'bold'}}>{item.value}</Box>
    </Box>
  </Box>
}
