import {SudokuData, Cell, Value} from '../model/sudoku'
import {AppState} from '../model/state'

const edgeLineStyle = {stroke: "black", strokeWidth: "1px", fill: "none"}
const boldLineStyle = {stroke: "black", strokeWidth: "4px", fill: "none"}
const targetLineStyle = {stroke: "red", strokeWidth: "1px", fill: "none"}
const clueStyle = {fontFamily: "Roboto,Helvetica,Arial,sans-serif", fontWeight: "bold"}

interface Props {
  gridSize: number;
  sudokuData: SudokuData;
  appState: AppState;
}

export function Grid(props: Props) {

  const gap = 4
  const scale = 32

  const size = props.sudokuData.size;
  const areaMap = new AreaMap(size, props.sudokuData.areas)

  const viewBox = `${-gap} ${-gap} ${size*scale+2*gap} ${size*scale+2*gap}`

  const cells = cellsOf2DArray(size).map((cell, index) => DrawCell(cell, scale, index));
  const digits = (props.appState.state==='solving' || props.appState.state==='review')?
    props.sudokuData.clues.map((clue, index) => DrawDigit(clue.cell, scale, clue.value, index)) :
    <></>
  const outerEdges = DrawOuterEdge(size, scale)
  const innerHorizontalEdges = cellsOf2DArray(size)
      .filter(cell => areaMap.hasBottomBorder(cell))
      .map((cell,index) => DrawBottomEdge(cell, scale, index));
  const innerVerticalEdges = cellsOf2DArray(size)
      .filter(cell => areaMap.hasRightBorder(cell))
      .map((cell, index) => DrawRightEdge(cell, scale, index));
  const target = DrawTarget(props.sudokuData.goal.cell, scale)
  
  return (
    <svg viewBox={viewBox} style={{width: props.gridSize, height: props.gridSize }} >
      {cells}
      {digits}
      {innerHorizontalEdges}
      {innerVerticalEdges}
      {outerEdges}
      {target}
    </svg>
  )
}

function cellsOf2DArray(size: number): Cell[] {
  return [...Array(size)].map((_: undefined, row: number) => (
    [...Array(size)].map((_: undefined, column: number) => new Cell(row, column))
  )).flatMap(item => item)
}

function init2DArray<T>(size: number, value: T): T[][] {
  return new Array(size).fill(value).map(() => new Array(size).fill(value))
}


class AreaMap {
  size: number;
  areaMap: number[][];
  
  constructor(size: number, areas: Cell[][]) {
    this.size = size;
    this.areaMap = init2DArray(size, 0);
    
    areas.forEach((areaData, areaIndex) => (
      areaData.forEach(cell => {
        this.areaMap[cell.column][cell.row] = areaIndex
      })
    ))
  }
  
  hasRightBorder(cell: Cell): boolean {
    return cell.column+1 < this.size && this.areaMap[cell.column][cell.row] !== this.areaMap[cell.column+1][cell.row]
  }

  hasBottomBorder(cell: Cell): boolean {
    return cell.row+1 < this.size && this.areaMap[cell.column][cell.row] !== this.areaMap[cell.column][cell.row+1]
  }
}

function DrawTarget(cell: Cell, scale: number) {
  const center = {x: cell.column*scale + scale/2, y: cell.row*scale + scale/2}
  const r1 = 3
  const r2 = scale/6+1
  const r3 = scale/3-1
  const r4 = scale/2-3
  return (
    <>
      <circle cx={center.x} cy={center.y} r={r1} style={targetLineStyle}></circle>
      <circle cx={center.x} cy={center.y} r={r2} style={targetLineStyle}></circle>
      <circle cx={center.x} cy={center.y} r={r3} style={targetLineStyle}></circle>
      <circle cx={center.x} cy={center.y} r={r4} style={targetLineStyle}></circle>
      <line x1={center.x} x2={center.x} y1={center.y-r2+2} y2={center.y-r3} strokeLinecap="round" style={targetLineStyle}></line>
      <line x1={center.x} x2={center.x} y1={center.y+r2-2} y2={center.y+r3} strokeLinecap="round" style={targetLineStyle}></line>
      <line x1={center.x-r2+2} x2={center.x-r3} y1={center.y} y2={center.y} strokeLinecap="round" style={targetLineStyle}></line>
      <line x1={center.x+r2-2} x2={center.x+r3} y1={center.y} y2={center.y} strokeLinecap="round" style={targetLineStyle}></line>
    </>
  )
}
  
function DrawCell(cell: Cell, scale: number, index: number) {
  return <rect key={index} x={cell.column*scale} y={cell.row*scale} width={scale} height={scale} style={edgeLineStyle}></rect>
}

function DrawDigit(cell: Cell, scale: number, value: Value, index: number) {
  const center = {x: cell.column*scale + scale/2, y: cell.row*scale + scale/2}
  return <text key={index} x={center.x} y={center.y} textAnchor="middle" dominantBaseline="central" fontSize={scale*2/3} style={clueStyle}>{value.value}</text>
}

function DrawBottomEdge(cell: Cell, scale: number, index: number) {
  const corner = {x: cell.column*scale+scale, y: cell.row*scale+scale}
  return <line key={index} x1={corner.x-scale} y1={corner.y} x2={corner.x} y2={corner.y} strokeLinecap="round" style={boldLineStyle}></line>
}

function DrawRightEdge(cell: Cell, scale: number, index: number) {
  const corner = {x: cell.column*scale+scale, y: cell.row*scale+scale}
  return <line key={index} x1={corner.x} y1={corner.y-scale} x2={corner.x} y2={corner.y} strokeLinecap="round" style={boldLineStyle}></line>
}

function DrawOuterEdge(size: number, scale: number) {
  return <rect key="outer" x="0" y="0" width={scale*size} height={scale*size} style={boldLineStyle}></rect>
}
  
