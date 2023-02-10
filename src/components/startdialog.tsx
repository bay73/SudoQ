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
    text = 'How about defining the target digit in 6x6 sudoku? This should not be too hard for you.'
  } else if (props.sudokuData.size === 7) {
    text = '7x7 sudoku may be a bit trickier. Can you determine the target digit here?'
  } else if (props.sudokuData.size === 8) {
    text = 'You are getting closer to a final. It can take some time. Find the right digit for 8x8 grid.'
  } else if (props.sudokuData.size > 8) {
    text = 'Now you have a really tough challenge. What is the target digit in this puzzle?'
  }
  
  const explanatoryText = "Press the help button if you need more information about the Sudoku rules."

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
        <DialogContentText gutterBottom={true} id='dialog-description'>
          {text}
        </DialogContentText>
        <DialogContentText variant={'body2'} id='dialog-help'>
          {explanatoryText}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant='contained' autoFocus onClick = {()=>onStartClick()}>Start</Button>
        <Button variant='outlined' onClick = {()=>onHelpClick()}>Help</Button>
      </DialogActions>
    </Dialog>
  )
}