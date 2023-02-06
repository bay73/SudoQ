import React from 'react'
import {Box, Typography} from '@mui/material'

interface Props {
  sudokuSize: number;
  areaWidth: number;
  areaHeight: number;
}


export function Header(props: Props) {
  if (props.areaWidth > 4*props.areaHeight)  {
    return (
      <Box>
        <Typography variant="h1" align="center" style={{fontSize: props.areaHeight*2/3}}>Sudoku {props.sudokuSize}x{props.sudokuSize}</Typography>
      </Box>
    );
  } else {
    const fontSize = props.areaWidth < 3*props.areaHeight ? props.areaWidth/4 : props.areaHeight/2
    return (
      <Box>
        <Typography variant="h1" align="center" style={{fontSize: fontSize*4/5 }}>Sudoku</Typography>
        <Typography variant="h1" align="center" style={{fontSize: fontSize }}>{props.sudokuSize}x{props.sudokuSize}</Typography>
      </Box>
    );
  }
}