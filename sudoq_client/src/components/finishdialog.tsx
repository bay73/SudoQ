import {Paper, Typography} from '@mui/material'
import {AppState} from '../model/state'
import {SingleResult, SolvingStat} from '../model/solving_stat'

interface Props {
  appState: AppState,
  solvingStat: SolvingStat
}

function getRating(result: SingleResult): number {
  if (result.solved) {
    const realValue = Math.exp(-Math.pow((Math.sqrt(Math.log(2))*result.time/result.medianTime),2))
    return (0.4 + realValue*0.6) * result.size
  } else {
    return 0
  }
}

export function FinishDialog(props: Props) {

    const sumIndexes = Object.keys(props.solvingStat.results).reduce((total, index) => total + parseInt(index), 0);
    const rating = Object.entries(props.solvingStat.results).map((entry) => getRating(entry[1])).reduce((total, value) => total + value, 0)/sumIndexes;
    const sudoQ = Math.round(rating * 200)

    return (
      <Paper elevation={12} sx={{p:1}}>
        <Typography variant="h2" align="center">Your SudoQ today</Typography>
        <Typography variant="h1" align="center">{sudoQ}</Typography>
      </Paper>
    );
}