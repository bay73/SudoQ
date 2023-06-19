import { randomPuzzle } from './random'
import { Data, saveToFile } from './filesaver'

const data = new Data()

for (let size=4;size<10;size++) {
  data.data.push(randomPuzzle(size, 4, 100));
}

saveToFile(data, 'data')

console.log(JSON.stringify(data))
