import { randomPuzzle } from './random'
import { Data, saveToFile } from './filesaver'

const data = new Data()

for (let index=0;index<50;index++) {
  const size = 4 + Math.floor(Math.random() * 6)
  console.log(size)
  data.data.push(randomPuzzle(size, 1, 6));
}

data.data = data.data.sort((p1, p2) => p1.medianTime - p2.medianTime)

saveToFile(data, 'sprintdata')

console.log(JSON.stringify(data))
