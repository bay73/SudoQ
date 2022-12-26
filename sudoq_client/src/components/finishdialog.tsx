import React from 'react'
import {Paper, Typography} from '@mui/material'
import {AppState} from '../model/state'
import {SingleResult, SolvingStat} from '../model/solving_stat'
import {debounce} from './utils'

const numberStyle = {fontFamily: "Roboto,Helvetica,Arial,sans-serif", fontWeight: "bold"}

interface Props {
  appState: AppState,
  solvingStat: SolvingStat
}

function getRating(result: SingleResult): number {
  if (result.solved) {
    const realValue = Math.exp(-Math.pow((Math.sqrt(Math.log(2))*result.time/result.medianTime),2))
    return 0.4 + realValue*0.6
  } else {
    return 0
  }
}

function saveRating(rating: number) {
  const dateInStorage = localStorage.getItem('historyStartDate')
  let startDate = dateInStorage===null ? undefined : new Date(dateInStorage)
  if (typeof startDate=='undefined' || startDate===null) {
    startDate = new Date()
    startDate.setHours(0,0,0,0)
    localStorage.setItem('historyStartDate', startDate.toLocaleString())
  }
  const dayNum = Math.floor((Date.now() - startDate.getTime())/(1000 * 3600 * 24))
  localStorage.setItem('history'+dayNum, rating.toString())
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
  const ratings = sizes.map((size) => {return {size: size, rating: getRating(props.solvingStat.results[size])} }).sort((r1, r2) => r2.size-r1.size)
  const sumIndexes = sizes.reduce((total, size) => total + size, 0)
  const rating = ratings.reduce((total, value) => total + value.rating*value.size, 0)/sumIndexes
  const sudoQ = Math.round(rating * 200)

  saveRating(sudoQ)

  const hGap = 0.25
  const vGap = 0.25
  const usedHeight = dimensions.height/ (1+hGap)
  const usedWidth = dimensions.width/ (1+vGap)

  const gap = 4
  const scale = 32
  const size = Math.max(...sizes);
  const viewBox = `${-gap} ${-gap} ${size*scale+2*gap} ${size*scale+2*gap}`
  const squares = ratings.map(r => drawSquare(r.size, r.rating, scale))
  const numbers = ratings.map(r => drawNumber(r.size, r.rating, scale))
  const ratingPicture = drawRating(rating, scale)

  const headerFraction = 0.3
  let gridSize = usedHeight / (1+headerFraction)
  gridSize = gridSize > usedWidth ? usedWidth : gridSize

  return (
    <Paper elevation={12} sx={{p:1, textAlign: "center"}}>
      <Typography variant="h3" align="center" sx={{my: 3}} >Your SudoQ today is {sudoQ}</Typography>
      <svg viewBox={viewBox} style={{width: gridSize, height: gridSize }} >
        {squares}
        {numbers}
        {ratingPicture}
      </svg>
    </Paper>
  );
}

function drawSquare(size: number, value: number, scale: number) {
  const colorNegativeComponent = (240-Math.round(value*200)).toString(16)
  const color = "#"+colorNegativeComponent+colorNegativeComponent+"f0"
  return <rect key={size} x="0" y="0" width={size*scale} height={size*scale} style={{stroke: "black", strokeWidth: "1px", fill: color}}></rect>
}

function drawNumber(size: number, value: number, scale: number) {
  return <text key={size} x={scale*3/2} y={size*scale-scale/6} textAnchor="end" fontSize={scale/2} style={numberStyle}>{Math.round(value*200)}</text>
}

function drawRating(value: number, scale: number) {
  return <text x={2*scale} y={2*scale} textAnchor="middle" dominantBaseline="central" fontSize={scale*2} style={numberStyle}>{Math.round(value*200)}</text>
}
