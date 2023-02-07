import {Stack, Button, Typography} from '@mui/material'
import {SudokuData} from '../model/sudoku'
import {Storage} from '../data/storage'
import {SolvingStat} from '../model/solving_stat'
import {AppState} from '../model/state'

const defaultSpaceSize = 8 

interface Props {
  areaWidth: number;
  areaHeight: number;
  sudokuData: SudokuData;
  appState: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  setSudokuData: React.Dispatch<React.SetStateAction<SudokuData | undefined>>;
  solvingStat: SolvingStat;
  setSolvingStat: React.Dispatch<React.SetStateAction<SolvingStat>>;
}

export function Buttons(props: Props) {
  const goal: number = props.sudokuData.goal.value.value
  const spacing = 1
  const direction = props.areaWidth > props.areaHeight ? "row": "column"
  const buttonSize = (direction === "row") ?
    props.areaWidth/props.sudokuData.size-defaultSpaceSize*spacing :
    props.areaHeight/props.sudokuData.size-defaultSpaceSize*spacing;
    
  const onClick = function(answer: number) {
    const solvingTime = Date.now() - props.appState.changeTime;
    const newSolvingStat = (answer === goal)?
      props.solvingStat.correct(props.sudokuData.size, solvingTime, props.sudokuData.medianTime*1000)
      : props.solvingStat.wrong(props.sudokuData.size, solvingTime, props.sudokuData.medianTime*1000);
    props.setSolvingStat(newSolvingStat)
    if (Storage.hasNext(props.sudokuData.size)) {
      const next = Storage.next(props.sudokuData.size)
      if (next !== undefined) {
        props.setSudokuData(next);
        const state = new AppState("starting", next.size)
        state.sudokuSize = next.size
        props.setState(state);
      } else {
        props.setState(props.appState.newState("init"));
      }
    } else {
      props.setState(props.appState.newState("finish"));
    }
  }
    
  const buttons = array(props.sudokuData.size).map(index => (
    <Button key={index}
      variant='contained'
      style={{maxWidth: buttonSize, maxHeight: buttonSize, minWidth: buttonSize, minHeight: buttonSize}}
      onClick={() => onClick(index+1)}
    >
      <Typography style={{fontWeight: 'bold', fontSize: buttonSize*0.7}}>{index + 1}</Typography>
    </Button>
  ));
  return (
    <Stack spacing={spacing} direction = {direction}>
      {buttons}
    </Stack>
  );
}

function array(size: number): number[] {
  return [...Array(size)].map((_: undefined, item: number) => (item))
}
