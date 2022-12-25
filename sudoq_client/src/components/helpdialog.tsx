import {Paper, Typography, Box, Button} from '@mui/material'
import {AppState} from '../model/state'
import {SingleResult, SolvingStat} from '../model/solving_stat'

interface Props {
  appState: AppState,
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export function HelpDialog(props: Props) {

  const onClose = function() {
    props.setState(props.appState.newState("starting"));
  }

  return (
    <Paper elevation={12} sx={{p:1}}>
      <Typography variant="h3" align="center" sx={{py: 2}}>SudoQ test</Typography>
      <Typography align="justify" sx={{lineHeight: 1.5}}>
        <Typography sx={{py: 1}}><Box component='span' sx={{fontWeight: 'bold'}}>SudoQ</Box> test allows you to measure your Sudoku solving skills.</Typography>
        <Typography sx={{py: 1}}>In <Box component='span' sx={{fontWeight: 'bold'}}>Sudoku</Box> puzzle the goal is to fill in all the cells of a grid with digits so that no digits can repeat in rows, columns and outlined areas.
        Some digits are already placed. Only digits from the range 1..[grid size] can be used. Each Sudoku puzzle has unique solution and the digits can be determined logically one by one.</Typography>
        <Typography sx={{py: 1}}>In <Box component='span' sx={{fontWeight: 'bold'}}>SudoQ</Box> you face six grids of different sizes and in each of the grids you need to determine just one digit which should be set in a cell marked as a target. You have only one attempt for each puzzle.</Typography>
        <Typography sx={{py: 1}}>Based on your answers and time spent on each puzzle your SudoQ rating will be counted. The maximum possible (and unreachable by humans) value for the rating is 200. You can measure you skills every day and see how it evolves over time.</Typography>
      </Typography>

      <Button variant='contained' autoFocus onClick = {()=>onClose()}>Back to Sudoku</Button>
    </Paper>
  );
}