import { existsSync, writeFileSync } from 'fs';

export class Data {
  data: Record<string, any>[]
  
  constructor() {
    this.data = []
  }
}

export function saveToFile(data: Data, folder: string) {
  let today = new Date();
  let saved = false
  while(!saved) {
    const fileName = "public/" + folder + "/" +
                today.getFullYear() + "/" +
                ("00" + (today.getMonth()+1)).slice(-2) + "/" +
                ("00" + today.getDate()).slice(-2) + ".json"
    if (!existsSync(fileName)) {
      console.log(fileName)
      writeFileSync(fileName, JSON.stringify(data))
      saved = true
    }
    today.setDate(today.getDate() + 1)
  }
}
