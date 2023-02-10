import {Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button} from '@mui/material'
import {AppState} from '../model/state'
import {SudokuData} from '../model/sudoku'

interface Props {
  appState: AppState,
  setState: React.Dispatch<React.SetStateAction<AppState>>
  sudokuData: SudokuData
}

export function StartDialog(props: Props) {
  let text = 'Which digit should be in the targeted cell in correctly solved sudoku?'
  
  if (props.sudokuData.size === 5) {
    text = 'Can you find the digit in the targeted cell for a bigger grid?'
  } else if (props.sudokuData.size === 6) {
    text = 'How about defining the target digit in 6x6 sudoku?'
  } else if (props.sudokuData.size === 7) {
    text = '7x7 sudoku may be trickier. Can you determine the target digit here?'
  } else if (props.sudokuData.size > 7) {
    text = 'Now you have a real challenge. What is the target digit in this puzzle?'
  }

  const onStartClick = function() {
    props.setState(props.appState.newState("solving"));
  }

  const onHelpClick = function() {
    props.setState(props.appState.newState("help"));
  }

  return (
    <Dialog open={props.appState.state==='starting'} aria-labelledby='dialog-title' aria-describedby='dialog-description'>
      <DialogTitle id='dialog-title'>Just one digit</DialogTitle>
      <DialogContent>
        <DialogContentText id='dialog-description'>
          {text}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant='contained' autoFocus onClick = {()=>onStartClick()}>Start</Button>
        <Button variant='outlined' onClick = {()=>onHelpClick()}>Help</Button>
      </DialogActions>
    </Dialog>
  )
}