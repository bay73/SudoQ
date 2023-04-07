import React from 'react'
import {Stack, Paper, Typography, Button} from '@mui/material'
import {AppState} from '../model/state'
import {SingleResult, SolvingStat} from '../model/solving_stat'
import {debounce} from './utils'
import {LinkShareButton} from './share'
import {getStartDate, epochStart, getDateFromDay} from '../model/history'

const numberStyle = {fontFamily: "Roboto,Helvetica,Arial,sans-serif", fontWeight: "bold"}

const sudoqScale = 200

interface Props {
  appState: AppState,
  setState: React.Dispatch<React.SetStateAction<AppState>>,
  solvingStat: SolvingStat
}

function getRating(result: SingleResult): number {
  if (result.solved) {
    const minimalRating = result.size*0.045
    const realValue = Math.exp(-Math.pow((Math.sqrt(Math.log(2))*result.time/result.medianTime),2))
    return minimalRating + realValue * (1 - minimalRating)
  } else {
    return 0
  }
}

function saveRating(rating: number) {
  const historyInStorage = localStorage.getItem('history')
  let history: any = {}
  let startDate: Date | null = getStartDate(historyInStorage)
  if (startDate != null) {
    if (historyInStorage != null) {
      history = JSON.parse(historyInStorage)
    }
  } else {
    startDate = new Date()
    startDate.setHours(0,0,0,0)
  }
  if ( history["historyStart"] === undefined) {
    const historyStart = Math.floor((startDate.valueOf() - epochStart.valueOf())/(1000 * 3600 * 24))
    history["historyStart"] = historyStart
    startDate = getDateFromDay(historyStart)
  }
  const dayNum = Math.floor((Date.now() - startDate.valueOf())/(1000 * 3600 * 24))
  history['history'+dayNum] = rating.toString()
  localStorage.setItem('history', JSON.stringify(history))
}

export function FinishDialog(props: Props) {

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

  const sizes = Object.keys(props.solvingStat.results).map(key=>parseInt(key)).sort()
  const partialRatings = sizes.map((size) => {return {size: size, rating: getRating(props.solvingStat.results[size])} }).sort((r1, r2) => r2.size-r1.size)
  const sumSizes = sizes.reduce((total, size) => total + size, 0)
  const averageRating = partialRatings.reduce((total, value) => total + value.rating*value.size, 0)/sumSizes
  const sudoQ = Math.round(averageRating * sudoqScale)

  saveRating(sudoQ)

  const hGap = 0.25
  const vGap = 0.28
  const usedHeight = dimensions.height/ (1+vGap)
  const usedWidth = dimensions.width/ (1+hGap)

  const gap = 4
  const scale = 32
  const size = Math.max(...sizes);
  const viewBox = `${-gap} ${-gap} ${size*scale+2*gap} ${size*scale+2*gap}`
  const squares = partialRatings.map(r => drawPartialRatingSquare(r.size, r.rating, scale))
  const numbers = partialRatings.map(r => drawPartialRatingNumber(r.size, r.rating, scale))
  const ratingPicture = drawRatingNumber(averageRating, scale)

  const headerFraction = 0.3
  let gridSize = usedHeight / (1+headerFraction)
  gridSize = gridSize > usedWidth ? usedWidth : gridSize


  const onReviewClick = function() {
    props.setState(props.appState.newState("review"));
  }

  const onHistoryClick = function() {
    props.setState(props.appState.newState("history"));
  }

  return (
    <Paper elevation={12} sx={{p:1, textAlign: "center", my: 2}}>
      <Stack spacing={2} direction="column" justifyContent="space-evenly" alignItems="center">
        <Typography variant="h3" align="center">Your SudoQ today is {sudoQ}</Typography>
        <Typography>Try new puzzles tomorrow</Typography>
        <svg viewBox={viewBox} style={{width: gridSize, height: gridSize }} >
          {squares}
          {numbers}
          {ratingPicture}
        </svg>
        <LinkShareButton
          buttonText = "Share Link"
          shareText = {'My SudoQ today is ' + sudoQ + '. Check you Sudoku solving skills at #SudoQ. https://sudoq.site'}
        />
        <Button variant='outlined' onClick = {onReviewClick}>Review puzzles</Button>
        <Button variant='outlined' onClick = {onHistoryClick}>SudoQ history</Button>
      </Stack>
    </Paper>
  );
}

function drawPartialRatingSquare(size: number, value: number, scale: number) {
  const colorNegativeComponent = (216-Math.round(value*sudoqScale)).toString(16)
  const color = "#"+colorNegativeComponent+colorNegativeComponent+"ff"
  return <rect key={size} x="0" y="0" width={size*scale} height={size*scale} rx={scale/8} style={{stroke: "black", strokeWidth: "2px", fill: color}}></rect>
}

function drawPartialRatingNumber(size: number, value: number, scale: number) {
  return <text key={size} x={scale*3/2} y={size*scale-scale/6} textAnchor="end" fontSize={scale/2} style={numberStyle}>{Math.round(value*sudoqScale)}</text>
}

function drawRatingNumber(value: number, scale: number) {
  return <text x={2*scale} y={2*scale} textAnchor="middle" dominantBaseline="central" fontSize={scale*2} style={numberStyle}>{Math.round(value*200)}</text>
}
